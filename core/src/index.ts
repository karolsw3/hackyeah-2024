import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { instructions } from "./instructions";
import { MESSAGE_END_TAG, DATA_START_TAG, DATA_END_TAG } from "../../constants";
import { genAI } from "./helpers/genAI";
import mongoose from "mongoose";
import jwt from "@elysiajs/jwt";
import { v4 as uuidv4 } from 'uuid';
import { Conversation, MessageRole } from "./models/Conversation.model";
import cors from "@elysiajs/cors";
import { Content } from "@google/generative-ai";
import { createPCCDeclarationXml } from "./helpers/createPCCDeclarationXml";
import { getMessagesWithXml } from "./helpers/getMessagesWithXml";

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-002",
});
const generationConfig = {
  temperature: 0.3,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: "text/plain",
};

const startApp = async () => {
  await mongoose.connect(Bun.env.MONGODB_URI!, {
    dbName: Bun.env.MONGODB_DBNAME!,
  })
  console.log('🍃 Connected to MongoDB')
  const app = new Elysia()
    .use(cors())
    .use(swagger)
    .use(
      jwt({
        name: 'jwt',
        secret: Bun.env.JWT_SECRET!,
        schema: t.Object({
          userId: t.String()
        })
      })
    )
    .post("/users", async ({ set, cookie: { auth }, jwt }) => {
      auth.set({
        value: await jwt.sign({ userId: uuidv4() }),
        httpOnly: true,
        maxAge: 7 * 86400,
      })
      set.status = 201
      return
    })
    .post("/messages", async function* ({ body, jwt, cookie: { auth }, error }) {
      const jwtData = await jwt.verify(auth.value)
      if (!jwtData) {
        return error('Unauthorized', 401)
      }
      const conversation = await Conversation.findOne({ _id: body.conversationId })
      if (!conversation) {
        return error('Not Found', 404)
      }
      if (conversation.userId !== jwtData.userId) {
        return error('Unauthorized', 401)
      }
      const userMessageTimestamp = Date.now()

      const userContent: Content = {
        role: "user",
        parts: [{ text: body.message }],
      }
      if (body.fileData && body.mimeType) {
        userContent.parts.push({
          inlineData: {
            mimeType: body.mimeType,
            data: body.fileData
          }
        })
      }
    
      const result = await model.generateContentStream({
        systemInstruction: instructions,
        contents: [
          ...conversation.messages.map(message => ({
            role: message.role === MessageRole.USER ? "user" : "model",
            parts: [{ text: message.text }],
          })),
          userContent,
        ],
        generationConfig,
      })

      let text = '';
      let messageYieldFinished = false;
      for await (const message of result.stream) {
        const textChunk = message.text();
        text += textChunk;
        if (messageYieldFinished) continue;
        if (!text.includes(MESSAGE_END_TAG)) {
          yield textChunk;
        } else if (text.includes(MESSAGE_END_TAG)) {
          // Yield starting from textChunk to the end of the message
          const messageStartIndex = text.indexOf(textChunk);
          const messageEndIndex = text.indexOf(MESSAGE_END_TAG) + MESSAGE_END_TAG.length;
          yield text.slice(messageStartIndex, messageEndIndex);
          messageYieldFinished = true;
        }
      }
      
      // Process data after message yielding is complete
      if (text.indexOf(DATA_START_TAG) && text.includes(MESSAGE_END_TAG)) {
        const dataText = text.slice(text.indexOf(DATA_START_TAG) + DATA_START_TAG.length, text.indexOf(DATA_END_TAG));
        if (dataText.length > 0) {
          try {
            const data = JSON.parse(dataText);
            if (data.pccDeclaration) {
              const pccDeclarationXml = createPCCDeclarationXml(data.pccDeclaration);
              yield `${DATA_START_TAG}${pccDeclarationXml}${DATA_END_TAG}`;
            }
          } catch (error) {
            console.error('Error parsing data', error);
          }
        }
      }

      // Add the user message and the AI completion to the conversation
      conversation.messages.push({
        role: MessageRole.USER,
        text: body.message,
        timestamp: userMessageTimestamp
      }, {
        role: MessageRole.COMPLETION,
        text,
        timestamp: Date.now()
      })
      await conversation.save()
    }, {
      body: t.Object({
        message: t.String({
          maxLength: 1000,
          minLength: 0
        }),
        conversationId: t.String(),
        fileData: t.Optional(t.String()),
        mimeType: t.Optional(t.String())
      })
    })
    .get("/conversations", async ({ jwt, cookie: { auth } }) => {
      const jwtData = await jwt.verify(auth.value)
      if (!jwtData) {
        return {
          conversations: []
        }
      }
      const conversations = await Conversation.find({ userId: jwtData.userId })
      return {
        conversations: conversations.map(conversation => {
          const modifiedMessages = getMessagesWithXml(conversation.messages)
          return {
            ...conversation.toJSON(),
            messages: modifiedMessages
          }
        })
      }
    })
    .post("/conversations", async ({ jwt, cookie: { auth }, error }) => {
      const jwtData = await jwt.verify(auth.value)
      if (!jwtData) {
        return error('Unauthorized', 401)
      }
      const conversation = await Conversation.create({ userId: jwtData.userId })
      return conversation.toJSON()
    })
    .post("/conversations/:conversationId", async ({ jwt, cookie: { auth }, body, params, error }) => {
      const jwtData = await jwt.verify(auth.value)
      if (!jwtData) {
        return error('Unauthorized', 401)
      }
      const conversation = await Conversation.findOne({ _id: params.conversationId })
      if (!conversation) {
        return error('Not Found', 404)
      }
      if (conversation.userId !== jwtData.userId) {
        return error('Unauthorized', 401)
      }
      conversation.label = body.label
      await conversation.save()
      return conversation.toJSON()
    }, {
      params: t.Object({
        conversationId: t.String()
      }),
      body: t.Object({
        label: t.String()
      })
    })
    .listen(Bun.env.PORT ?? 3000);

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}

startApp();
