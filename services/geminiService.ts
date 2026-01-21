
import { GoogleGenAI, Type } from "@google/genai";
import { AgentInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateThoughtInsight(transcript: string): Promise<AgentInsight | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following thought transcript and provide structured insights: "${transcript}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coreEssence: {
              type: Type.STRING,
              description: "A single sentence that captures the deep meaning of the thought.",
            },
            logicalFramework: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 3 key logical points or connections.",
            },
            thinkingPrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Two thought-provoking questions to explore this idea further.",
            },
          },
          required: ["coreEssence", "logicalFramework", "thinkingPrompts"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AgentInsight;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
}
