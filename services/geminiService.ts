import { GoogleGenAI, Type } from "@google/genai";

// We strictly assume process.env.API_KEY is available.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Uses Gemini to break down a complex task into 3-5 actionable subtasks.
 */
export const breakDownTask = async (taskDescription: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning empty suggestion.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Break down the following task into 3 to 5 smaller, actionable subtasks: "${taskDescription}". Keep them concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of actionable subtasks."
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsed = JSON.parse(jsonText);
    return parsed.subtasks || [];
  } catch (error) {
    console.error("Failed to generate subtasks with Gemini:", error);
    return [];
  }
};
