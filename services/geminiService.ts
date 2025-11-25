import { GoogleGenAI, Type } from "@google/genai";
import { FileItem, FileType } from "../types";

// Initialize Gemini Client
// NOTE: In a real production app, this would be backend-side to protect the key.
// Since this is a "Local Server" concept running on the user's machine, having the key here is acceptable for the demo context.
const apiKey = process.env.API_KEY || ''; 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeFileMetadata = async (file: FileItem): Promise<{ description: string; tags: string[] }> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning mock data.");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return {
      description: `Auto-generated description for ${file.name}. (AI unavailable)`,
      tags: ['local', file.type, 'offline']
    };
  }

  try {
    const prompt = `
      Analyze this filename: "${file.name}" and file type: "${file.type}".
      Provide a short, professional 1-sentence description of what this file likely contains.
      Also provide 3 short relevant tags.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      description: "Analysis failed or timed out.",
      tags: ['error', 'manual-review']
    };
  }
};
