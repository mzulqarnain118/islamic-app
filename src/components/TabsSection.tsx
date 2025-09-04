"use client";

import { Info, Baby, ChevronRight } from "lucide-react";
import surahFatihaData from "@/data/surah-al-fatiha.json";

interface TabsSectionProps {
  currentView: "word" | "ayah" | "surah";
  setCurrentView: (view: "word" | "ayah" | "surah") => void;
  isChildMode: boolean;
  setIsChildMode: (mode: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  currentLanguage: any;
  setIsLanguageMenuOpen: (open: boolean) => void;
  isLanguageMenuOpen: boolean;
}

export default function TabsSection({
  currentView,
  setCurrentView,
  isChildMode,
  setIsChildMode,
  selectedLanguage,
  setSelectedLanguage,
  currentLanguage,
  setIsLanguageMenuOpen,
  isLanguageMenuOpen,
}: TabsSectionProps) {
  const tabs = [
    { id: "word", label: "Word", active: currentView === "word" },
    { id: "ayah", label: "Ayah", active: currentView === "ayah" },
    { id: "surah", label: "Full Surah", active: currentView === "surah" },
  ];

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setCurrentView(tab.id as "word" | "ayah" | "surah")
                }
                className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                  tab.active
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsChildMode(!isChildMode)}
              className={`p-2 rounded-full transition-colors ${
                isChildMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Child Mode"
            >
              <Baby className="w-5 h-5" />
            </button>

            <button
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Info"
            >
              <Info className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="text-lg">{currentLanguage?.flag}</span>
                <span className="text-sm font-medium">
                  {currentLanguage?.name}
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isLanguageMenuOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-64 overflow-y-auto w-64">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {surahFatihaData.languages.map((language) => (
                      <button
                        key={language.id}
                        onClick={() => {
                          setSelectedLanguage(language.code);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-left hover:bg-green-50 transition-colors ${
                          selectedLanguage === language.code
                            ? "bg-green-100 text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span className="text-sm font-medium truncate">
                          {language.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
