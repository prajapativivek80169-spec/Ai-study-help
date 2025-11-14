
import { GoogleGenAI, GenerateContentResponse, Part, Type } from "@google/genai";
import { SendMessageOptions } from "../types";

const SYSTEM_INSTRUCTION = `You are an AI Study Helper designed for school and college students. Your job is to provide clear, short, and exam-oriented study material.

TASKS:
Generate clean, simple, student-friendly notes
Summarize long chapters
Give perfect 2–3 line answers
Solve basic maths problems with steps
Provide exam-focused explanations

OUTPUT RULES:
Always write in simple language
No complicated vocabulary
Keep answers short, clear, and accurate
For summary → 8-12 lines
For short answers → 2-3 lines
For notes → bullet points
For maths → step-by-step solution
Never add unnecessary extra paragraphs

FEATURES:
You can produce:
Chapter notes
Definitions
Formulas
Short summaries
2-3 line board-exam answers
Step-by-step maths solutions
Examples for hard topics

TONE:
Friendly
Helpful
Teacher-like
Very easy to understand`;

const createGeminiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Extract base64 part, removing the data URL prefix
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as Data URL."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function sendMessageToGemini(
  options: SendMessageOptions
): Promise<string> {
  const { prompt, imageFile, thinkingMode } = options;
  const ai = createGeminiClient();

  const modelName = thinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  const config = thinkingMode
    ? { systemInstruction: SYSTEM_INSTRUCTION, thinkingConfig: { thinkingBudget: 32768 } }
    : { systemInstruction: SYSTEM_INSTRUCTION };

  let response: GenerateContentResponse;

  if (imageFile) {
    const base64ImageData = await fileToBase64(imageFile);
    const imagePart: Part = {
      inlineData: {
        mimeType: imageFile.type,
        data: base64ImageData,
      },
    };
    const textPart: Part = { text: prompt };

    try {
      // Image analysis always uses gemini-2.5-flash as per requirements
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });
    } catch (error) {
      console.error("Error analyzing image with Gemini:", error);
      throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    // Text-only generation, model depends on thinkingMode
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: config,
      });
    } catch (error) {
      console.error("Error generating text with Gemini:", error);
      throw new Error(`Failed to generate text: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Extract text from the response
  return response.text;
}
