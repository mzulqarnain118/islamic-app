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

  // List of available reciters
  const reciters = [
    { id: "mishary_alafasy", name: "Mishary Alafasy" },
    { id: "abdul_basit", name: "Abdul Basit" },
    { id: "saad_al_ghamdi", name: "Saad Al-Ghamdi" },
    { id: "maher_al_muaiqly", name: "Maher Al-Muaiqly" },
    { id: "muhammad_ayyoub", name: "Muhammad Ayyoub" },
  ];

  const [selectedReciter, setSelectedReciter] = useState(reciters[0].id);

  return (
    <div className="container mx-auto px-4 py-4 bg-white rounded-lg shadow-md ">
      {/* Audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Progress bar */}
      <div className="space-y-2 mb-4">
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

      {/* Main Controls */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentAyah === 1}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Ayah"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Play/Pause Button */}
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

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentAyah === surahFatihaData.ayahs.length}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Ayah"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center space-x-6">
          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Restart Current Ayah"
          >
            <RotateCcw className="w-4 h-4" />
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
              className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
          </div>

          {/* Playback Speed */}
          <div className="flex items-center space-x-2">
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="text-xs border rounded px-2 py-1  text-gray-600"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
            </select>
          </div>

          {/* Reciter Selection */}
          <div className="flex items-center space-x-2 text-gray-600">
            <select
              value={selectedReciter}
              onChange={(e) => setSelectedReciter(e.target.value)}
              className="text-xs border rounded px-2 py-1  text-gray-600"
            >
              {reciters.map((reciter) => (
                <option key={reciter.id} value={reciter.id}>
                  {reciter.name}
                </option>
              ))}
            </select>
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
    </div>
  );
}
