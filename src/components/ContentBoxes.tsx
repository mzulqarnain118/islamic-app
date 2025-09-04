"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Volume2,
  X,
  Play,
  Pause,
} from "lucide-react";
import { Verse, Word, TranslationResource } from "@/types/api";
import surahFatihaData from "@/data/surah-al-fatiha.json";

interface ContentBoxesProps {
  currentView: "word" | "ayah" | "surah";
  surahData: {
    verses: Verse[];
    audioData: any;
    translations: TranslationResource[];
    chapter: any;
    chapterInfo: any;
    reciters: any[];
  };
  currentAyah: number;
  setCurrentAyah: (ayah: number) => void;
  currentWord: number;
  selectedTranslation1: number;
  selectedTranslation2: number;
  setSelectedTranslation1: (translation: number) => void;
  setSelectedTranslation2: (translation: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  onWordClick: (word: any) => void;
  selectedWord: any;
  setSelectedWord: (word: any) => void;
  availableTranslations: TranslationResource[];
  selectedLanguage: string;
  isLanguageMenuOpen: boolean;
  setIsLanguageMenuOpen: (open: boolean) => void;
}

export default function ContentBoxes({
  currentView,
  surahData,
  currentAyah,
  setCurrentAyah,
  currentWord,
  selectedTranslation1,
  selectedTranslation2,
  setSelectedTranslation1,
  setSelectedTranslation2,
  fontSize,
  setFontSize,
  onWordClick,
  selectedWord,
  setSelectedWord,
  availableTranslations,
  selectedLanguage,
  isLanguageMenuOpen,
  setIsLanguageMenuOpen,
}: ContentBoxesProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlayingWordAudio, setIsPlayingWordAudio] = useState(false);
  const [currentPlayingWord, setCurrentPlayingWord] = useState<string | null>(
    null
  );
  const [isPlayingAyahAudio, setIsPlayingAyahAudio] = useState(false);

  const wordAudioRef = useRef<HTMLAudioElement>(null);
  const ayahAudioRef = useRef<HTMLAudioElement>(null);

  // Generate word audio URL
  const getWordAudioUrl = (word: Word, verseKey: string) => {
    const [chapterNum, verseNum] = verseKey.split(":");
    const chapterPadded = chapterNum.padStart(3, "0");
    const versePadded = verseNum.padStart(3, "0");
    const wordPadded = word.position.toString().padStart(3, "0");
    return `https://audio.qurancdn.com/wbw/${chapterPadded}_${versePadded}_${wordPadded}.mp3`;
  };

  // Generate ayah audio URL
  const getAyahAudioUrl = (ayahNumber: number) => {
    return `https://cdn.islamic.network/quran/audio/128/mis_031/1${ayahNumber
      .toString()
      .padStart(3, "0")}.mp3`;
  };

  // Play/pause word audio
  const handleWordAudioPlayPause = (word: Word, verseKey: string) => {
    const audioUrl = getWordAudioUrl(word, verseKey);
    if (!audioUrl) return;

    const audio = wordAudioRef.current;
    if (!audio) return;

    const wordKey = `${verseKey}_${word.position}`;

    if (isPlayingWordAudio && currentPlayingWord === wordKey) {
      audio.pause();
      setIsPlayingWordAudio(false);
      setCurrentPlayingWord(null);
    } else {
      audio.src = audioUrl;
      audio
        .play()
        .then(() => {
          setIsPlayingWordAudio(true);
          setCurrentPlayingWord(wordKey);
        })
        .catch((error) => {
          console.error("Error playing word audio:", error);
        });
    }
  };

  // Play/pause ayah audio
  const handleAyahAudioPlayPause = (ayahNumber: number) => {
    const audioUrl = getAyahAudioUrl(ayahNumber);
    const audio = ayahAudioRef.current;
    if (!audio) return;

    if (isPlayingAyahAudio) {
      audio.pause();
      setIsPlayingAyahAudio(false);
    } else {
      audio.src = audioUrl;
      audio
        .play()
        .then(() => {
          setIsPlayingAyahAudio(true);
        })
        .catch((error) => {
          console.error("Error playing ayah audio:", error);
          setIsPlayingAyahAudio(false);
        });
    }
  };

  // Handle audio end events
  const handleWordAudioEnd = () => {
    setIsPlayingWordAudio(false);
    setCurrentPlayingWord(null);
  };

  const handleAyahAudioEnd = () => {
    setIsPlayingAyahAudio(false);
  };

  const handlePrevious = () => {
    if (currentView === "word") {
      if (currentWordIndex > 0) {
        setCurrentWordIndex(currentWordIndex - 1);
      }
    }
  };

  const handleNext = () => {
    if (currentView === "word") {
      const totalWords = surahData.verses.reduce(
        (total: number, verse: Verse) => total + verse.words.length,
        0
      );
      if (currentWordIndex < totalWords - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      }
    }
  };

  const getCurrentWord = (): Word | null => {
    let wordIndex = 0;
    for (const verse of surahData.verses) {
      for (const word of verse.words) {
        if (wordIndex === currentWordIndex) {
          return word;
        }
        wordIndex++;
      }
    }
    return null;
  };

  const getTranslationText = (verse: Verse, translationId: number): string => {
    const translation = verse.translations.find(
      (t) => t.resource_id === translationId
    );
    return translation?.text || "Translation not available";
  };

  // Get translation from local data
  const getLocalTranslation = (
    ayahNumber: number,
    languageCode: string
  ): string => {
    const ayah = surahFatihaData.ayahs.find((a) => a.number === ayahNumber);
    if (!ayah) return "Translation not available";

    return (
      ayah.translations[languageCode as keyof typeof ayah.translations] ||
      ayah.translations.en ||
      "Translation not available"
    );
  };

  // Get transliteration from local data
  const getLocalTransliteration = (ayahNumber: number): string => {
    const ayah = surahFatihaData.ayahs.find((a) => a.number === ayahNumber);
    return ayah?.transliteration || "Transliteration not available";
  };

  // Get Arabic text from local data
  const getLocalArabicText = (ayahNumber: number): string => {
    const ayah = surahFatihaData.ayahs.find((a) => a.number === ayahNumber);
    return ayah?.arabic || "Arabic text not available";
  };

  const renderWordView = () => {
    const word = getCurrentWord();
    if (!word) return null;

    // Find the verse this word belongs to
    let currentVerse: Verse | null = null;
    let wordIndexInVerse = 0;

    for (const verse of surahData.verses) {
      for (let i = 0; i < verse.words.length; i++) {
        if (verse.words[i].id === word.id) {
          currentVerse = verse;
          wordIndexInVerse = i;
          break;
        }
      }
      if (currentVerse) break;
    }

    const totalWords = surahData.verses.reduce(
      (total: number, verse: Verse) => total + verse.words.length,
      0
    );

    const wordKey = currentVerse
      ? `${currentVerse.verseKey}_${word.position}`
      : `${word.position}`;
    const isCurrentWordPlaying =
      isPlayingWordAudio && currentPlayingWord === wordKey;

    return (
      <div className="space-y-6">
        {/* Hidden audio element for word audio */}
        <audio ref={wordAudioRef} onEnded={handleWordAudioEnd} preload="none" />

        {/* Arabic Word Box */}
        <div className="bg-white rounded-lg shadow-md p-8 relative">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div
                className="text-6xl font-bold text-gray-800 cursor-pointer hover:text-green-600 transition-colors"
                style={{ fontSize: `${fontSize * 2.5}px` }}
                dir="rtl"
                onClick={() => onWordClick(word)}
              >
                {word.text}
              </div>
              {/* Clickable Audio Button */}
              <button
                onClick={() =>
                  currentVerse &&
                  handleWordAudioPlayPause(word, currentVerse.verseKey)
                }
                className="ml-4 p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                title="Play word audio"
              >
                {isCurrentWordPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200 hover:border-green-500"
            disabled={currentWordIndex === 0}
          >
            <ChevronLeft
              className={`w-6 h-6 ${
                currentWordIndex === 0
                  ? "text-gray-300"
                  : "text-gray-600 hover:text-green-600"
              }`}
            />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200 hover:border-green-500"
            disabled={currentWordIndex >= totalWords - 1}
          >
            <ChevronRight
              className={`w-6 h-6 ${
                currentWordIndex >= totalWords - 1
                  ? "text-gray-300"
                  : "text-gray-600 hover:text-green-600"
              }`}
            />
          </button>
        </div>

        {/* Translation and Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transliteration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Transliteration
              </span>
              <Globe className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="text-xl font-semibold text-gray-800">
                {word.transliteration?.text || "N/A"}
              </div>
              <div className="text-gray-600">
                {word.translation?.text || "Translation not available"}
              </div>
            </div>
          </div>

          {/* Word Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Word Details
              </span>
              <Volume2 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2 text-gray-600">
              <div>
                <span className="font-medium">Position:</span> {word.position}
              </div>
              <div>
                <span className="font-medium">Page:</span> {word.pageNumber}
              </div>
              <div>
                <span className="font-medium">Line:</span> {word.lineNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Font Size Slider */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Font Size Control
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Small
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="16"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #16a34a 0%, #16a34a ${
                    ((fontSize - 16) / 16) * 100
                  }%, #e5e7eb ${((fontSize - 16) / 16) * 100}%, #e5e7eb 100%)`,
                }}
              />
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Large
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-600">
              Current size: {fontSize}px
            </span>
            <button
              onClick={() => setFontSize(24)}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAyahView = () => {
    return (
      <div className="space-y-6">
        {/* Hidden audio element for ayah audio */}
        <audio ref={ayahAudioRef} onEnded={handleAyahAudioEnd} preload="none" />

        {/* Arabic Verse */}
        <div className="bg-white rounded-lg shadow-md p-2 relative">
          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setCurrentAyah(Math.max(1, currentAyah - 1))}
                disabled={currentAyah === 1}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div
                className="text-3xl font-bold text-gray-800 leading-relaxed"
                dir="rtl"
              >
                {getLocalArabicText(currentAyah)}
              </div>

              <button
                onClick={() =>
                  setCurrentAyah(
                    Math.min(surahFatihaData.ayahs.length, currentAyah + 1)
                  )
                }
                disabled={currentAyah === surahFatihaData.ayahs.length}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center mb-2 gap-8">
              {/* Ayah Audio Button */}
              <button
                onClick={() => handleAyahAudioPlayPause(currentAyah)}
                className="ml-4 p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                title="Play ayah audio"
              >
                {isPlayingAyahAudio ? (
                  <Pause className="w-2 h-2" />
                ) : (
                  <Play className="w-2 h-2" />
                )}
              </button>
              <div className="text-sm text-gray-500 mb-1">
                {currentAyah} : {surahFatihaData.ayahs.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transliteration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-lg italic text-gray-700 leading-relaxed text-center">
              {getLocalTransliteration(currentAyah)}
            </div>
          </div>

          {/* Translation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center mb-4"></div>
            <div className="text-lg text-gray-700 leading-relaxed text-center">
              {getLocalTranslation(currentAyah, selectedLanguage)}
            </div>
          </div>
        </div>

        {/* Font Size Slider */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Font Size Control
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Small
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="16"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #16a34a 0%, #16a34a ${
                    ((fontSize - 16) / 16) * 100
                  }%, #e5e7eb ${((fontSize - 16) / 16) * 100}%, #e5e7eb 100%)`,
                }}
              />
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Large
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-600">
              Current size: {fontSize}px
            </span>
            <button
              onClick={() => setFontSize(24)}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSurahView = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {surahFatihaData.surah.arabicName}
          </h2>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {surahFatihaData.surah.name} ({surahFatihaData.surah.englishName})
          </h3>
          <p className="text-gray-600">
            {surahFatihaData.surah.numberOfAyahs} verses •{" "}
            {surahFatihaData.surah.revelationType}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p className="italic">Full Surah - Arabic Only</p>
          </div>
        </div>

        <div className="space-y-8">
          {surahFatihaData.ayahs.map((ayah, index) => (
            <div key={ayah.number} className="text-center">
              <div
                className="text-xl font-bold text-gray-800 leading-relaxed mb-4"
                style={{ fontSize: `${fontSize * 1.8}px` }}
                dir="rtl"
              >
                {ayah.arabic}
              </div>
              {/* Verse number circle - centered below the Arabic text */}
              <div className="flex justify-center mb-4">
                <span className="w-10 h-10 bg-green-600 text-white rounded-full text-lg leading-10 font-normal">
                  {ayah.number}
                </span>
              </div>
              {index < surahFatihaData.ayahs.length - 1 && (
                <div className="mt-8 border-b border-gray-200"></div>
              )}
            </div>
          ))}
        </div>

        {/* Font Size Control for Surah View */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Font Size Control
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Small
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="16"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #16a34a 0%, #16a34a ${
                    ((fontSize - 16) / 16) * 100
                  }%, #e5e7eb ${((fontSize - 16) / 16) * 100}%, #e5e7eb 100%)`,
                }}
              />
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Large
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-600">
              Current size: {fontSize}px
            </span>
            <button
              onClick={() => setFontSize(24)}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLanguageMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".relative")) {
          setIsLanguageMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageMenuOpen]);

  return (
    <div className="container mx-auto px-4 py-8">
      {currentView === "word" && renderWordView()}
      {currentView === "ayah" && renderAyahView()}
      {currentView === "surah" && renderSurahView()}
    </div>
  );
}
