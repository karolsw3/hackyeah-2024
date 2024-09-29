import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { instructions } from "./instructions";
import { MESSAGE_END_TAG, MESSAGE_START_TAG } from "../../constants";
import { genAI } from "./helpers/genAI";
import mongoose from "mongoose";
import jwt from "@elysiajs/jwt";
import { v4 as uuidv4 } from 'uuid';
import { Conversation, MessageRole } from "./models/Conversation.model";
import cors from "@elysiajs/cors";
import { generateTextToSpeech } from "./helpers/generateTextToSpeech";
import { Content } from "@google/generative-ai";

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
      for await (const message of result.stream) {
        const textChunk = message.text();
        text += textChunk;
        yield textChunk;
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
      const messageStartTagIndex = text.indexOf(MESSAGE_START_TAG)
      const messageEndTagIndex = text.indexOf(MESSAGE_END_TAG)
      const message = text.slice(messageStartTagIndex + MESSAGE_START_TAG.length, messageEndTagIndex)
      // const textToSpeechResponse = await generateTextToSpeech(message)
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
        conversations: conversations.map(conversation => conversation.toJSON())
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
    .listen(Bun.env.PORT ?? 3000);

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}

startApp();
