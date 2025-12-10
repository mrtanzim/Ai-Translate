
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { TranslationResult } from "../types";

// Ensure API key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "dummy-key" });

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
            properties: {
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
  imageData?: string
): Promise<TranslationResult> => {
  try {
    const model = "gemini-2.5-flash"; 
    
    const parts: any[] = [];
    
    if (imageData) {
       // Handle Base64 Data safely
       let base64Data = "";
       let mimeType = "image/jpeg";

       if (imageData.includes(',')) {
         const split = imageData.split(',');
         base64Data = split[1];
         // Try extracting mime type
         const matches = imageData.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
         if (matches && matches[1]) {
           mimeType = matches[1];
         }
       } else {
         base64Data = imageData;
       }
       
       if (base64Data) {
         parts.push({
           inlineData: {
             data: base64Data,
             mimeType: mimeType,
           }
         });
       }

       parts.push({
         text: `Analyze this image. 
         1. If it contains text, perform OCR and translate it to ${targetLang}.
         2. If it does NOT contain text, describe the visual content in ${targetLang}.
         
         Provide a comprehensive response adhering to the schema.`
       });
    } else {
       parts.push({
         text: `Translate the following text to ${targetLang} (Language Code): "${text}".
         
         Analyze the text for tone, grammar, and context.
         Provide synonyms, antonyms, definitions, and pronunciation guides if applicable.
         `
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

    let resultText = response.text;
    if (!resultText) throw new Error("Received empty response from AI service.");

    // Clean up potential markdown formatting (```json ... ```)
    resultText = resultText.replace(/```json\n?|\n?```/g, "").trim();

    try {
      return JSON.parse(resultText) as TranslationResult;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", resultText);
      throw new Error("Failed to parse the translation data. The AI response was not in the expected format.");
    }

  } catch (error: any) {
    console.error("Translation Service Error:", error);
    
    if (error.message?.includes("API_KEY")) {
      throw new Error("API Key is invalid or missing.");
    }
    // Handle 500 errors specifically
    if (error.message?.includes("500") || error.message?.includes("Rpc failed")) {
      throw new Error("The translation service encountered a temporary error. This is often caused by a network interruption or an issue with the AI model provider. Please try again in a moment.");
    }
    if (error.message?.includes("fetch")) {
      throw new Error("Network error. Please check your internet connection.");
    }
    
    throw error;
  }
};
