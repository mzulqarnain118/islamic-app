"use client";

import { Chapter } from "@/types/api";

interface MiddleSectionProps {
  chapter?: Chapter;
}

export default function MiddleSection({ chapter }: MiddleSectionProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 py-4">
      <div className="container mx-auto px-4 text-center">
        {/* International Text */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
            {chapter?.nameArabic || "سُورَةُ الْفَاتِحَة"}
          </h2>
        </div>
      </div>
    </div>
  );
}
