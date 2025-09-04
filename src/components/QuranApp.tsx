"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import MiddleSection from "./MiddleSection";
import TabsSection from "./TabsSection";
import ContentBoxes from "./ContentBoxes";
import AudioPlayer from "./AudioPlayer";
import ImageSlider from "./ImageSlider";
import Footer from "./Footer";
import { fetchSurahFatihaData, handleApiError } from "@/services/quranApi";
import surahFatihaData from "@/data/surah-al-fatiha.json";
import {
  Verse,
  AudioFile,
  TranslationResource,
  Chapter,
  Reciter,
} from "@/types/api";

interface SurahData {
  verses: Verse[];
  audioData: AudioFile | null;
  translations: TranslationResource[];
  chapter: Chapter;
  chapterInfo: any;
  reciters: Reciter[];
}

export default function QuranApp() {
  const [currentView, setCurrentView] = useState<"word" | "ayah" | "surah">(
    "ayah" // Start with ayah view as requested
  );
  const [selectedTranslation1, setSelectedTranslation1] = useState(131); // Dr. Mustafa Khattab
  const [selectedTranslation2, setSelectedTranslation2] = useState(20); // Sahih International
  const [fontSize, setFontSize] = useState(24); // Increased default font size
  const [isChildMode, setIsChildMode] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [currentWord, setCurrentWord] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTranslations, setAvailableTranslations] = useState<
    TranslationResource[]
  >([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const currentLanguage = surahFatihaData.languages.find(
    (lang) => lang.code === selectedLanguage
  );
  useEffect(() => {
    const loadSurahData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch from API first, but fallback to local data if needed
        try {
          const data = await fetchSurahFatihaData();
          setSurahData(data);
          setAvailableTranslations(data.translations);

          // Set default translations if available
          if (data.translations.length > 0) {
            // Look for popular English translations first
            const sahih = data.translations.find((t) => t.id === 20); // Sahih International
            const yusufAli = data.translations.find((t) => t.id === 22); // Yusuf Ali
            const pickthall = data.translations.find((t) => t.id === 19); // Pickthall

            // Set first translation
            if (sahih) setSelectedTranslation1(20);
            else if (yusufAli) setSelectedTranslation1(22);
            else if (pickthall) setSelectedTranslation1(19);
            else setSelectedTranslation1(data.translations[0].id);

            // Set second translation (try to find a different one)
            if (yusufAli && selectedTranslation1 !== 22)
              setSelectedTranslation2(22);
            else if (pickthall && selectedTranslation1 !== 19)
              setSelectedTranslation2(19);
            else if (sahih && selectedTranslation1 !== 20)
              setSelectedTranslation2(20);
            else if (data.translations.length > 1) {
              // Find a different translation than the first one
              const secondTranslation = data.translations.find(
                (t) => t.id !== selectedTranslation1
              );
              if (secondTranslation)
                setSelectedTranslation2(secondTranslation.id);
            }
          }
        } catch (apiError) {
          console.warn("API fetch failed, using local data:", apiError);

          // Fallback to local data structure
          const mockSurahData: SurahData = {
            verses: [], // We'll use local data instead
            audioData: {
              id: 1,
              chapterId: 1,
              fileSize: 0,
              format: "mp3",
              audioUrl: surahFatihaData.audio.baseUrl,
              audio_url: surahFatihaData.audio.baseUrl,
              duration: 0,
              segments: [],
              verseTimings: [],
              verse_timings: [],
            },
            translations: [], // We'll use local translations
            chapter: {
              id: surahFatihaData.surah.id,
              revelationPlace: surahFatihaData.surah.revelationType,
              revelationOrder: 5,
              bismillahPre: true,
              nameSimple: surahFatihaData.surah.name,
              nameComplex: surahFatihaData.surah.arabicName,
              nameArabic: surahFatihaData.surah.arabicName,
              versesCount: surahFatihaData.surah.numberOfAyahs,
              pages: [1, 1],
              translatedName: {
                languageName: "english",
                name: surahFatihaData.surah.englishName,
              },
            },
            chapterInfo: {
              chapterId: surahFatihaData.surah.id,
              languageName: "english",
              shortText: `${surahFatihaData.surah.numberOfAyahs} verses • ${surahFatihaData.surah.revelationType}`,
              source: "local",
            },
            reciters: [
              {
                id: 1,
                name: surahFatihaData.audio.reciter,
                arabicName: "",
                relativePath: "",
                format: "mp3",
                bitrate: "128",
                languageName: "english",
                style: "Murattal",
                qirat: "Hafs",
                translatedName: {
                  name: surahFatihaData.audio.reciter,
                  languageName: "english",
                },
                approvedDate: "2024-01-01",
                profilePicture: "",
                coverImage: "",
                downloadAllowed: true,
                streamingAllowed: true,
              },
            ],
          };

          setSurahData(mockSurahData);
          setAvailableTranslations([]);
        }
      } catch (error) {
        console.error("Error loading Surah data:", error);
        setError(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadSurahData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading Surah Al-Fatiha...</p>
          <p className="text-sm text-gray-500 mt-2">The Opening Chapter</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Failed to Load Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!surahData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Row 1: Header */}
      <Header />

      {/* Row 2: Middle Section - Updated to use local data */}
      <MiddleSection chapter={surahData.chapter} />

      {/* Row 3: Tabs Section */}
      <TabsSection
        currentView={currentView}
        setCurrentView={setCurrentView}
        isChildMode={isChildMode}
        setIsChildMode={setIsChildMode}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        currentLanguage={currentLanguage}
        setIsLanguageMenuOpen={setIsLanguageMenuOpen}
        isLanguageMenuOpen={isLanguageMenuOpen}
      />

      {/* Row 4: Content Boxes - Main content area */}
      <ContentBoxes
        currentView={currentView}
        surahData={surahData}
        currentAyah={currentAyah}
        setCurrentAyah={setCurrentAyah}
        currentWord={currentWord}
        selectedTranslation1={selectedTranslation1}
        selectedTranslation2={selectedTranslation2}
        setSelectedTranslation1={setSelectedTranslation1}
        setSelectedTranslation2={setSelectedTranslation2}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onWordClick={setSelectedWord}
        selectedWord={selectedWord}
        setSelectedWord={setSelectedWord}
        availableTranslations={availableTranslations}
        selectedLanguage={selectedLanguage}
        isLanguageMenuOpen={isLanguageMenuOpen}
        setIsLanguageMenuOpen={setIsLanguageMenuOpen}
      />

      {/* Row 5: Audio Player - Enhanced with new features */}
      <AudioPlayer
        surahData={surahData}
        currentAyah={currentAyah}
        setCurrentAyah={setCurrentAyah}
        currentWord={currentWord}
        setCurrentWord={setCurrentWord}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />

      {/* Row 6: Image Slider */}
      <ImageSlider />

      {/* Row 7: Educational Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
            About Surah Al-Fatiha (The Opening)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700">
                Significance
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Surah Al-Fatiha is the first chapter of the Quran and is
                considered the most important surah for Muslims. It is recited
                in every unit of the five daily prayers and contains the essence
                of the entire Quran.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Prophet Muhammad (peace be upon him) said: "No prayer is
                complete without the recitation of Al-Fatiha."
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700">
                Key Features
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>
                    {surahFatihaData.surah.numberOfAyahs} verses (
                    {surahFatihaData.surah.revelationType})
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>
                    Available in {surahFatihaData.languages.length} languages
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>
                    Audio recitation by {surahFatihaData.audio.reciter}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Word-by-word translation and transliteration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>
                    Interactive audio player with verse synchronization
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Row 8: Footer */}
      <Footer />
    </div>
  );
}
