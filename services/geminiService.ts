import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateJobDescription = async (title: string, category: string, language: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning placeholder.");
    return "Please configure the API_KEY to generate descriptions automatically.";
  }

  try {
    const prompt = `Write a short, attractive, and clear job description (max 50 words) for a "${title}" role in the category of "${category}". The description should be encouraging for daily wage workers. Write it in ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Bengali'}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Description not available.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Could not generate description at this time.";
  }
};