"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  RotateCcw,
  Download,
} from "lucide-react";
import { AudioFile, VerseTiming } from "@/types/api";
import surahFatihaData from "@/data/surah-al-fatiha.json";

interface AudioPlayerProps {
  surahData: {
    verses: any[];
    audioData: AudioFile | null;
    translations: any[];
    chapter: any;
    chapterInfo: any;
    reciters: any[];
  };
  currentAyah: number;
  setCurrentAyah: (ayah: number) => void;
  currentWord: number;
  setCurrentWord: (word: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function AudioPlayer({
  surahData,
  currentAyah,
  setCurrentAyah,
  currentWord,
  setCurrentWord,
  isPlaying,
  setIsPlaying,
}: AudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isRepeatMode, setIsRepeatMode] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate audio URL for the current ayah
  const getAudioUrl = (ayahNumber: number = currentAyah) => {
    return `https://cdn.islamic.network/quran/audio/128/mis_031/1${ayahNumber
      .toString()
      .padStart(3, "0")}.mp3`;
  };

  // Load audio for current ayah
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioUrl = getAudioUrl(currentAyah);
    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      setCurrentTime(0);
    }
  }, [currentAyah]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      // Update progress based on timestamps from our local data
      const currentTimestamp = surahFatihaData.audio.timestamps.find(
        (timestamp) => timestamp.ayah === currentAyah
      );

      if (currentTimestamp) {
        // Check if we should move to next ayah based on duration
        if (audio.currentTime >= currentTimestamp.duration) {
          if (currentAyah < surahFatihaData.ayahs.length) {
            setCurrentAyah(currentAyah + 1);
          } else if (isRepeatMode) {
            setCurrentAyah(1); // Restart from first ayah
          } else {
            setIsPlaying(false);
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleEnded = () => {
      if (isRepeatMode) {
        // Repeat current ayah
        audio.currentTime = 0;
        audio.play();
      } else if (currentAyah < surahFatihaData.ayahs.length) {
        // Move to next ayah
        setCurrentAyah(currentAyah + 1);
      } else {
        // End of surah
        setIsPlaying(false);
        setCurrentAyah(1);
        setCurrentTime(0);
      }
    };

    const handleError = (e: any) => {
      setIsLoading(false);
      setIsPlaying(false);
      console.error("Audio playback error:", e);
    };

    // Set playback rate
    audio.playbackRate = playbackRate;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [currentAyah, setCurrentAyah, setIsPlaying, playbackRate, isRepeatMode]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Audio play error:", error);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentAyah > 1) {
      setCurrentAyah(currentAyah - 1);
      if (isPlaying) {
        // Small delay to ensure audio URL is updated
        setTimeout(() => {
          const audio = audioRef.current;
          if (audio) {
            audio.play().catch(console.error);
          }
        }, 100);
      }
    }
  };

  const handleNext = () => {
    if (currentAyah < surahFatihaData.ayahs.length) {
      setCurrentAyah(currentAyah + 1);
      if (isPlaying) {
        // Small delay to ensure audio URL is updated
        setTimeout(() => {
          const audio = audioRef.current;
          if (audio) {
            audio.play().catch(console.error);
          }
        }, 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  };

  const handleDownload = () => {
    const audioUrl = getAudioUrl(currentAyah);
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `Al-Fatiha-Ayah-${currentAyah}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const currentAyahData = surahFatihaData.ayahs.find(
    (ayah) => ayah.number === currentAyah
  );

  return (
    <div className="bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 py-4">
        {/* Audio element */}
        <audio ref={audioRef} preload="metadata" />

        {/* Main Player Section */}
        <div className="flex items-center justify-between mb-4">
          {/* Left section - Current Ayah info */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="text-sm text-gray-600 min-w-0">
              <div className="font-medium truncate">
                Ayah {currentAyah} of {surahFatihaData.ayahs.length}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {surahFatihaData.surah.name} -{" "}
                {surahFatihaData.surah.englishName}
              </div>
            </div>

            {/* Current Ayah Arabic Preview */}
            <div className="hidden md:block text-right flex-1 min-w-0">
              <div
                className="text-lg font-bold text-gray-800 truncate"
                dir="rtl"
              >
                {currentAyahData?.arabic}
              </div>
            </div>
          </div>

          {/* Center section - Main Controls */}
          <div className="flex items-center space-x-2 mx-4">
            <button
              onClick={handlePrevious}
              disabled={currentAyah === 1}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Ayah"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Restart Current Ayah"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="p-4 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentAyah === surahFatihaData.ayahs.length}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Ayah"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Repeat Toggle */}
            <button
              onClick={() => setIsRepeatMode(!isRepeatMode)}
              className={`p-2 rounded-full transition-colors ${
                isRepeatMode
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              title={isRepeatMode ? "Disable Repeat" : "Enable Repeat"}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Right section - Additional Controls */}
          <div className="flex items-center space-x-3">
            {/* Playback Speed */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-xs text-gray-600">Speed:</span>
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="text-xs border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Download Current Ayah"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 min-w-0">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #16a34a 0%, #16a34a ${
                    (currentTime / (duration || 1)) * 100
                  }%, #e5e7eb ${
                    (currentTime / (duration || 1)) * 100
                  }%, #e5e7eb 100%)`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500 min-w-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* Ayah Progress Indicators */}
          <div className="flex space-x-1">
            {surahFatihaData.ayahs.map((ayah) => (
              <button
                key={ayah.number}
                onClick={() => setCurrentAyah(ayah.number)}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  ayah.number === currentAyah
                    ? "bg-green-600"
                    : ayah.number < currentAyah
                    ? "bg-green-300"
                    : "bg-gray-200"
                }`}
                title={`Ayah ${ayah.number}`}
              />
            ))}
          </div>
        </div>

        {/* Current Ayah Info Bar */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Reciter: {surahFatihaData.audio.reciter}</span>
              <span
                className={`px-2 py-1 rounded-full ${
                  isRepeatMode ? "bg-green-100 text-green-700" : "bg-gray-100"
                }`}
              >
                {isRepeatMode ? "Repeat: ON" : "Repeat: OFF"}
              </span>
            </div>
            <div className="text-right">
              <div className="font-medium">Playing: Ayah {currentAyah}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
