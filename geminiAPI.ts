
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { TranslationResult } from '../types';

// Safely access process.env for web environment compatibility
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Could not access process.env");
  }
  return "";
};

const apiKey = getApiKey();
// Use a placeholder if missing to prevent initialization crash, but warn user
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    detected_language: { type: Type.STRING },
    detected_language_name: { type: Type.STRING },
    target_language: { type: Type.STRING },
    target_language_name: { type: Type.STRING },
    confidence: { type: Type.STRING },
    tone_detected: { type: Type.STRING },
    text_type: { type: Type.STRING },
    translations: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING },
        alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
        formal_version: { type: Type.STRING },
        casual_version: { type: Type.STRING }
      },
      required: ["primary", "alternatives"]
    },
    synonyms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          usage: { type: Type.STRING },
          context: { type: Type.STRING }
        }
      }
    },
    antonyms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          usage: { type: Type.STRING }
        }
      }
    },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          suggestion: { type: Type.STRING },
          reason: { type: Type.STRING },
          better_than_original: { type: Type.STRING }
        }
      }
    },
    grammar_check: {
      type: Type.OBJECT,
      properties: {
        has_errors: { type: Type.BOOLEAN },
        errors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            propertiesproperties: {
              type: { type: Type.STRING },
              original: { type: Type.STRING },
              corrected: { type: Type.STRING },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    },
    definitions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          part_of_speech: { type: Type.STRING },
          meanings: { type: Type.ARRAY, items: { type: Type.STRING } },
          etymology: { type: Type.STRING }
        }
      }
    },
    pronunciation: {
      type: Type.OBJECT,
      properties: {
        ipa: { type: Type.STRING },
        phonetic: { type: Type.STRING },
        audio_guide: { type: Type.STRING }
      }
    },
    example_sentences: { type: Type.ARRAY, items: { type: Type.STRING } },
    cultural_notes: { type: Type.STRING },
    related_words: { type: Type.ARRAY, items: { type: Type.STRING } },
    difficulty_level: { type: Type.STRING },
    usage_frequency: { type: Type.STRING }
  },
  required: ["detected_language", "translations"]
};

export const translateText = async (
  text: string,
  targetLang: string,
  base64Image?: string
): Promise<TranslationResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  try {
    const model = "gemini-2.5-flash";
    
    const parts: any[] = [];
    
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      });
      parts.push({
        text: `Analyze this image. If it contains text, OCR and translate to ${targetLang}. If not, describe it in ${targetLang}. Follow the JSON schema.`
      });
    } else {
      parts.push({
        text: `Translate this to ${targetLang}: "${text}"`
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, 
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No translation generated.");
    }

    return JSON.parse(resultText) as TranslationResult;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message && error.message.includes("Failed to fetch")) {
       throw new Error("Network error: Could not connect to the API. If you are in a web preview, this might be due to CORS restrictions.");
    }
    throw error;
  }
};
