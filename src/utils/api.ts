// Base URLs for Quran.com API
export const API_BASE_URL = "https://api.qurancdn.com/api/qdc";
export const STAGING_API_BASE_URL = "https://staging.quran.com/api/qdc";

// API endpoints
export const API_ENDPOINTS = {
  // Verses API
  VERSES_BY_CHAPTER: (chapterId: number) =>
    `${API_BASE_URL}/verses/by_chapter/${chapterId}`,
  VERSE_BY_KEY: (verseKey: string) =>
    `${API_BASE_URL}/verses/by_key/${verseKey}`,

  // Audio API
  AUDIO_FILES: (reciterId: number) =>
    `${API_BASE_URL}/audio/reciters/${reciterId}/audio_files`,
  AUDIO_TIMESTAMPS: (reciterId: number) =>
    `${API_BASE_URL}/audio/reciters/${reciterId}/timestamp`,
  CHAPTER_AUDIO: (chapterId: number, reciterId: number) =>
    `${API_BASE_URL}/chapters/${chapterId}/audio_files?reciter=${reciterId}`,

  // Resources API
  TRANSLATIONS: `${API_BASE_URL}/resources/translations`,
  WORD_BY_WORD_TRANSLATIONS: `${API_BASE_URL}/resources/word_by_word_translations`,
  RECITERS: `${API_BASE_URL}/audio/reciters`,

  // Chapters API
  CHAPTERS: `${API_BASE_URL}/chapters`,
  CHAPTER_INFO: (chapterId: number) =>
    `${API_BASE_URL}/chapters/${chapterId}/info`,
  CHAPTER_DETAIL: (chapterId: number) =>
    `${API_BASE_URL}/chapters/${chapterId}`,
};

// Common query parameters
export const QUERY_PARAMS = {
  SURAH_FATIHA: {
    words: true,
    translations: "131,20,161", // Multiple English translations
    translationFields: "resource_name,language_id",
    perPage: 10,
    fields: "text_uthmani,chapter_id,text_imlaei_simple,text_uthmani_simple",
    wordTranslationLanguage: "en",
  },
  AUDIO: {
    chapter: 1, // Surah Al-Fatiha
    segments: true,
  },
};

// Popular reciter IDs
export const POPULAR_RECITERS = {
  MISHARY_RASHID_ALAFASY: 7,
  ABDUL_RAHMAN_AL_SUDAIS: 1,
  MAHER_AL_MUAIQLY: 6,
  SAAD_AL_GHAMDI: 5,
  ABDUL_BASIT_ABDUL_SAMAD: 2,
};

// Popular translation IDs
export const POPULAR_TRANSLATIONS = {
  DR_MUSTAFA_KHATTAB: 131,
  SAHIH_INTERNATIONAL: 20,
  PICKTHALL: 19,
  YUSUF_ALI: 22,
  DR_GHALI: 17,
  ABDUL_HALEEM: 85,
};
