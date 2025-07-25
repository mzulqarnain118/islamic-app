// TypeScript interfaces for Quran.com API responses

export interface Word {
  id: number;
  position: number;
  audioUrl: string;
  charTypeName: string;
  codeV1: string;
  codeV2: string;
  lineNumber: number;
  pageNumber: number;
  text: string;
  textUthmani: string;
  textImlaei: string;
  textImlaeiSimple: string;
  className: string;
  translation: WordTranslation;
  transliteration: WordTransliteration;
}

export interface WordTranslation {
  id: number;
  languageId: number;
  languageName: string;
  text: string;
  resourceName: string;
  resourceId: number;
}

export interface WordTransliteration {
  id: number;
  languageId: number;
  languageName: string;
  text: string;
  resourceName: string;
  resourceId: number;
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
  resourceName?: string;
  resourceId?: number;
  languageName?: string;
}

export interface Verse {
  id: number;
  verseNumber: number;
  chapterId: number;
  verseKey: string;
  textUthmani: string;
  textUthmaniSimple: string;
  textImlaei: string;
  textImlaeiSimple: string;
  textIndopak: string;
  textUthmaniTajweed: string;
  juzNumber: number;
  hizbNumber: number;
  rubNumber: number;
  rukuNumber: number;
  manzilNumber: number;
  pageNumber: number;
  sajdahNumber: number;
  sajdahType: string;
  words: Word[];
  translations: Translation[];
  mediaContents: MediaContent[];
  audioUrl: string;
}

export interface MediaContent {
  url: string;
  embedText: string;
  provider: string;
  authorName: string;
}

export interface VersesResponse {
  verses: Verse[];
  pagination: {
    perPage: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    totalPages: number;
    totalRecords: number;
  };
}

export interface AudioFile {
  id: number;
  chapterId?: number;
  chapter_id?: number;
  fileSize?: number;
  file_size?: number;
  format: string;
  audioUrl?: string;
  audio_url?: string;
  duration: number;
  segments?: number[][];
  verseTimings?: VerseTiming[];
  verse_timings?: VerseTiming[];
}

export interface VerseTiming {
  verseKey?: string;
  verse_key?: string;
  timestampFrom?: number;
  timestamp_from?: number;
  timestampTo?: number;
  timestamp_to?: number;
  duration?: number;
  segments?: number[][];
}

export interface AudioResponse {
  audioFiles: AudioFile[];
}

export interface Reciter {
  id: number;
  name: string;
  arabicName: string;
  relativePath: string;
  format: string;
  bitrate: string;
  languageName: string;
  style: string;
  qirat: string;
  translatedName: TranslatedName;
  approvedDate: string;
  profilePicture: string;
  coverImage: string;
  downloadAllowed: boolean;
  streamingAllowed: boolean;
}

export interface TranslatedName {
  name: string;
  languageName: string;
}

export interface RecitersResponse {
  reciters: Reciter[];
}

export interface TranslationResource {
  id: number;
  name: string;
  authorName: string;
  slug: string;
  languageName: string;
  languageId: number;
  direction: string;
  translatedName: TranslatedName;
  approvedDate: string;
  groupedVersesCount: number;
  priority: number;
}

export interface TranslationsResponse {
  translations: TranslationResource[];
}

export interface Chapter {
  id: number;
  revelationPlace: string;
  revelationOrder: number;
  bismillahPre: boolean;
  nameSimple: string;
  nameComplex: string;
  nameArabic: string;
  versesCount: number;
  pages: number[];
  translatedName: TranslatedName;
}

export interface ChapterInfo {
  chapterInfo: {
    id: number;
    chapterId: number;
    languageId: number;
    shortText: string;
    source: string;
    text: string;
    languageName: string;
  };
}

export interface ChapterResponse {
  chapter: Chapter;
}

export interface ChaptersResponse {
  chapters: Chapter[];
}

export interface WordByWordTranslation {
  id: number;
  name: string;
  authorName: string;
  languageId: number;
  languageName: string;
  direction: string;
  translatedName: TranslatedName;
}

export interface WordByWordTranslationsResponse {
  wordByWordTranslations: WordByWordTranslation[];
}
