import { model, ObjectId, Schema } from "mongoose";

export enum MessageRole {
  USER = "USER",
  COMPLETION = "COMPLETION",
}

export interface IMessage {
  text: string;
  role: MessageRole;
  timestamp: number;
}

export interface IConversation {
  _id: ObjectId;
  messages: MessageRole[];
  userId: string;
}

const conversationSchema = new Schema<IConversation>({
  messages: {
    type: [Object],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
})

export const Conversation = model<IConversation>("Conversation", conversationSchema);
