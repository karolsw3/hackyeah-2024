import axios from "axios";
import { genAI } from "./genAI";

export const generateTextToSpeech = async (text: string) => {
  // Convert text with numbers and shortcuts to full text with small LLM
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-002",
    systemInstruction:  'Replace all numbers with words and expand all shortcuts in the text.',
  });
  const chatSession = model.startChat({
    generationConfig: {
      temperature: 0,
      topP: 0.7,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
    history: [
    ],
  });
  const result = await chatSession.sendMessage(text);
  const expandedText = result.response.text();
  // Generate audio from expanded text with LLM
  return await axios.post('https://api.elevenlabs.io/v1/text-to-speech/Pid5DJleNF2sxsuF6YKD', {
    text: expandedText,
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.7,
      use_speaker_boost: true
    },
    language_code: 'pl'
  }, {
    headers: {
      'xi-api-key': Bun.env.ELEVENLABS_API_KEY
    },
    responseType: 'stream'
  })
}
