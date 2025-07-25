import {
  API_ENDPOINTS,
  QUERY_PARAMS,
  POPULAR_RECITERS,
  POPULAR_TRANSLATIONS,
} from "@/utils/api";
import {
  VersesResponse,
  AudioResponse,
  TranslationsResponse,
  RecitersResponse,
  ChapterResponse,
  ChapterInfo,
  WordByWordTranslationsResponse,
} from "@/types/api";

// Utility function to build query string
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

// Fetch verses for a chapter (Surah Al-Fatiha)
export const fetchVersesByChapter = async (
  chapterId: number = 1
): Promise<VersesResponse> => {
  const queryString = buildQueryString(QUERY_PARAMS.SURAH_FATIHA);
  const response = await fetch(
    `${API_ENDPOINTS.VERSES_BY_CHAPTER(chapterId)}?${queryString}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch verses: ${response.statusText}`);
  }

  return response.json();
};

// Fetch audio data for a chapter
export const fetchAudioFiles = async (
  reciterId: number = POPULAR_RECITERS.MISHARY_RASHID_ALAFASY,
  chapterId: number = 1
): Promise<AudioResponse> => {
  // Use the correct endpoint format that returns 200 OK
  const response = await fetch(
    `${API_ENDPOINTS.AUDIO_FILES(reciterId)}?chapter=${chapterId}&segments=true`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch audio files: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Audio API Response:", JSON.stringify(data, null, 2));
  return data;
};

// Fetch word-level timestamps for audio synchronization
export const fetchAudioTimestamps = async (
  reciterId: number = POPULAR_RECITERS.MISHARY_RASHID_ALAFASY,
  verseKey: string = "112:1"
): Promise<any> => {
  const response = await fetch(
    `${API_ENDPOINTS.AUDIO_TIMESTAMPS(reciterId)}?verse_key=${verseKey}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch audio timestamps: ${response.statusText}`);
  }

  return response.json();
};

// Fetch available translations
export const fetchTranslations = async (
  language: string = "en"
): Promise<TranslationsResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.TRANSLATIONS}?language=${language}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch translations: ${response.statusText}`);
  }

  return response.json();
};

// Fetch word-by-word translations
export const fetchWordByWordTranslations = async (
  language: string = "en"
): Promise<WordByWordTranslationsResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.WORD_BY_WORD_TRANSLATIONS}?language=${language}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch word-by-word translations: ${response.statusText}`
    );
  }

  return response.json();
};

// Fetch available reciters
export const fetchReciters = async (
  locale: string = "en"
): Promise<RecitersResponse> => {
  const response = await fetch(`${API_ENDPOINTS.RECITERS}?locale=${locale}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch reciters: ${response.statusText}`);
  }

  return response.json();
};

// Fetch chapter information
export const fetchChapterInfo = async (
  chapterId: number = 112,
  language: string = "en"
): Promise<ChapterInfo> => {
  const response = await fetch(
    `${API_ENDPOINTS.CHAPTER_INFO(chapterId)}?language=${language}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch chapter info: ${response.statusText}`);
  }

  return response.json();
};

// Fetch chapter details
export const fetchChapterDetail = async (
  chapterId: number = 1,
  language: string = "en"
): Promise<ChapterResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.CHAPTER_DETAIL(chapterId)}?language=${language}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch chapter detail: ${response.statusText}`);
  }

  return response.json();
};

// Comprehensive function to fetch all data needed for Surah Al-Fatiha
export const fetchSurahFatihaData = async () => {
  try {
    const [
      versesResponse,
      audioResponse,
      translationsResponse,
      chapterResponse,
      chapterInfo,
      recitersResponse,
    ] = await Promise.all([
      fetchVersesByChapter(1),
      fetchAudioFiles(POPULAR_RECITERS.MISHARY_RASHID_ALAFASY, 1).catch(
        (error) => {
          console.error("Audio fetch failed:", error);
          return { audioFiles: [] }; // Return empty array if audio fails
        }
      ),
      fetchTranslations("en"),
      fetchChapterDetail(1, "en"),
      fetchChapterInfo(1, "en"),
      fetchReciters("en"),
    ]);

    // Log response structures for debugging
    console.log("Verses Response:", versesResponse);
    console.log("Audio Response:", audioResponse);
    console.log("Translations Response:", translationsResponse);
    console.log("Chapter Response:", chapterResponse);
    console.log("Chapter Info Response:", chapterInfo);
    console.log("Reciters Response:", recitersResponse);

    // Create fallback audio data if none available
    let audioData = null;
    if (audioResponse.audioFiles && audioResponse.audioFiles.length > 0) {
      audioData = audioResponse.audioFiles[0];
    } else {
      // Create a minimal audio object with fallback data
      audioData = {
        id: 1,
        chapterId: 1,
        fileSize: 0,
        format: "mp3",
        audioUrl: "", // Will be populated later or from verses
        duration: 0,
        segments: [],
        verseTimings: [],
      };
    }

    return {
      verses: versesResponse.verses,
      audioData,
      translations: translationsResponse.translations,
      chapter: chapterResponse.chapter,
      chapterInfo: chapterInfo.chapterInfo,
      reciters: recitersResponse.reciters,
      pagination: versesResponse.pagination,
    };
  } catch (error) {
    console.error("Error fetching Surah Al-Fatiha data:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
};

// Fetch specific verse by key
export const fetchVerseByKey = async (verseKey: string): Promise<any> => {
  const queryString = buildQueryString({
    words: true,
    translations: QUERY_PARAMS.SURAH_FATIHA.translations,
    wordTranslationLanguage: "en",
  });

  const response = await fetch(
    `${API_ENDPOINTS.VERSE_BY_KEY(verseKey)}?${queryString}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch verse: ${response.statusText}`);
  }

  return response.json();
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred while fetching data";
};
