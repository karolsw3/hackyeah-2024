import { model, ObjectId, Schema } from "mongoose";

export enum MessageRole {
  USER = "USER",
  COMPLETION = "COMPLETION",
}

export interface IMessage {
  text: string;
  role: MessageRole;
  timestamp: number;
  file?: {
    data: string;
    mimeType: string;
  };
}

export interface IConversation {
  _id: ObjectId;
  label?: string;
  messages: IMessage[];
  userId: string;
}

const conversationSchema = new Schema<IConversation>({
  label: {
    type: String,
  },
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
