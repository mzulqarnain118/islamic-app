"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  title: string;
}

export default function ImageSlider({ title }: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Placeholder images - replace with actual Islamic artwork/tajweed visuals
  const images = [
    {
      src: "/api/placeholder/400/250",
      alt: "Islamic Calligraphy 1",
      title: "Beautiful Calligraphy",
    },
    {
      src: "/api/placeholder/400/250",
      alt: "Islamic Calligraphy 2",
      title: "Quranic Verses",
    },
    {
      src: "/api/placeholder/400/250",
      alt: "Islamic Calligraphy 3",
      title: "Tajweed Rules",
    },
    {
      src: "/api/placeholder/400/250",
      alt: "Islamic Calligraphy 4",
      title: "Arabic Typography",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {title}
      </h2>

      <div className="relative max-w-md mx-auto">
        {/* Main image container */}
        <div className="relative overflow-hidden rounded-lg shadow-md">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <h3 className="text-white text-sm font-medium">
                    {image.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-1 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-1 rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-3 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Thumbnail navigation */}
        <div className="flex justify-center mt-6 space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                currentSlide === index
                  ? "border-green-600 opacity-100"
                  : "border-gray-300 opacity-60 hover:opacity-80"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
