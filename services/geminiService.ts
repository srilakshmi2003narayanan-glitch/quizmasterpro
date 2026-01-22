
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty } from "../types.ts";

// Initialize AI. Using a getter or checking existence to prevent crashes if process.env is missing
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-init' });
};

export async function generateQuizQuestions(
  category: string,
  difficulty: Difficulty,
  count: number
): Promise<Question[]> {
  try {
    const ai = getAI();
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

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    const questions: Question[] = JSON.parse(text.trim());
    return questions.map(q => ({
      ...q,
      category,
      difficulty,
      type: q.type as any
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback to static mock data if Gemini fails or key is missing
    return Array.from({ length: count }).map((_, i) => ({
      id: `fallback-${i}-${Date.now()}`,
      category,
      difficulty,
      question: `Question ${i + 1}: (Fallback) What is the main gas in Earth's atmosphere?`,
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
      correctAnswer: 'Nitrogen',
      type: 'mcq'
    }));
  }
}
