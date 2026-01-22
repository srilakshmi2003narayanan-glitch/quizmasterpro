
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty } from "../types.ts";

// Always use the process.env.API_KEY directly in the constructor as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuizQuestions(
  category: string,
  difficulty: Difficulty,
  count: number
): Promise<Question[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} ${difficulty} level quiz questions for the category: ${category}. Return a list of JSON objects.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "type"]
          }
        }
      }
    });

    // Directly access .text property as per guidelines.
    const questions: Question[] = JSON.parse(response.text.trim());
    return questions.map(q => ({
      ...q,
      category,
      difficulty,
      type: q.type as any
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback to static mock data if Gemini fails
    return Array.from({ length: count }).map((_, i) => ({
      id: `fallback-${i}`,
      category,
      difficulty,
      question: `Fallback Question ${i + 1}: What is the capital of France?`,
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris',
      type: 'mcq'
    }));
  }
}
