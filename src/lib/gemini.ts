
import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "Gemini API key is missing. Please configure GEMINI_API_KEY in your .env file."
    );
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
    });
  }

  return geminiClient;
}
