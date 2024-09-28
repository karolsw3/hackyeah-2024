import { model, ObjectId, Schema } from "mongoose";

export enum IMessageRole {
  USER = "USER",
  COMPLETION = "COMPLETION",
}

export interface IMessage {
  text: string;
  role: IMessageRole;
  timestamp: number;
}

export interface IConversation {
  _id: ObjectId;
  messages: IMessageRole[];
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
