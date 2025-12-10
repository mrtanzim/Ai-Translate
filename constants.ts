
import { Language, AppSettings } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  autoDetectLanguage: true,
  showPronunciation: true,
  translationSpeed: 'balanced',
  glassmorphismLevel: 'medium',
  voiceSpeed: 'normal',
  autoPlayTranslation: false,
};

export const SYSTEM_PROMPT = `
You are TranslateAI - an advanced multilingual translation assistant.

CORE CAPABILITIES:
1. Smart Translation: Instant, context-aware translation
2. Synonym & Antonym Library: Alternatives with usage examples
3. Sentence Enhancement: Suggest improved versions
4. Grammar & Style Check: Detect and correct errors
5. Word Definition & Etymology
6. Pronunciation Guide: IPA + phonetic
7. Language Detection & Cultural Notes

RESPONSE FORMAT (Strict JSON):
Return a single JSON object conforming to the schema.
{
  "detected_language": "code",
  "detected_language_name": "string",
  "target_language": "code",
  "target_language_name": "string",
  "confidence": "percentage string",
  "tone_detected": "formal|informal|neutral|professional|casual",
  "text_type": "word|sentence|paragraph",
  "translations": {
    "primary": "string",
    "alternatives": ["string"],
    "formal_version": "string",
    "casual_version": "string"
  },
  "synonyms": [{"word": "string", "usage": "string", "context": "string"}],
  "antonyms": [{"word": "string", "usage": "string"}],
  "improvements": [{"suggestion": "string", "reason": "string", "better_than_original": "string"}],
  "grammar_check": {
    "has_errors": boolean,
    "errors": [{"type": "string", "original": "string", "corrected": "string", "explanation": "string"}]
  },
  "definitions": [{"word": "string", "part_of_speech": "string", "meanings": ["string"], "etymology": "string"}],
  "pronunciation": {"ipa": "string", "phonetic": "string", "audio_guide": "string"},
  "example_sentences": ["string"],
  "cultural_notes": "string",
  "related_words": ["string"],
  "difficulty_level": "beginner|intermediate|advanced",
  "usage_frequency": "common|moderate|rare"
}

BEHAVIOR RULES:
- Maintain original emotional tone.
- Provide culturally appropriate translations.
- Be concise but comprehensive.
`;
