import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(Bun.env.AISTUDIO_API_KEY!);
