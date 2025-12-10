
export interface TranslationResult {
  detected_language: string;
  detected_language_name?: string;
  target_language: string;
  target_language_name?: string;
  confidence?: string;
  tone_detected?: string;
  text_type?: string;
  translations: {
    primary: string;
    alternatives: string[];
    formal_version?: string;
    casual_version?: string;
  };
  synonyms?: Array<{ word: string; usage: string; context?: string }>;
  antonyms?: Array<{ word: string; usage: string }>;
  improvements?: Array<{ suggestion: string; reason: string; better_than_original?: string }>;
  grammar_check?: {
    has_errors: boolean;
    errors?: Array<{ type: string; original: string; corrected: string; explanation: string }>;
  };
  definitions?: Array<{
    word: string;
    part_of_speech: string;
    meanings: string[];
    etymology?: string;
  }>;
  pronunciation?: {
    ipa?: string;
    phonetic?: string;
    audio_guide?: string;
  };
  example_sentences?: string[];
  cultural_notes?: string;
  related_words?: string[];
  difficulty_level?: string;
  usage_frequency?: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface HistoryItem extends TranslationResult {
  id: string;
  original_text: string;
  timestamp: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  autoDetectLanguage: boolean;
  showPronunciation: boolean;
  translationSpeed: 'fast' | 'balanced' | 'accurate';
  glassmorphismLevel: 'low' | 'medium' | 'high';
  voiceSpeed: 'slow' | 'normal' | 'fast';
  autoPlayTranslation: boolean;
}

export interface UserProfile {
  name: string;
  translationsCount: number;
  languagesUsed: string[];
  streakDays: number;
  level: 'Beginner' | 'Intermediate' | 'Polyglot';
}

// Web Speech API Types
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}
