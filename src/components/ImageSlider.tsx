"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Test images for Al-Fatihah
  const images = [
    {
      src: "/al-fatihah-1.jpg",
      alt: "Surah Al-Fatihah 1",
      title: "Al-Fatihah 1",
    },
    {
      src: "/al-fatihah-2.jpg",
      alt: "Surah Al-Fatihah 2",
      title: "Al-Fatihah 2",
    },
    {
      src: "/al-fatihah-3.jpg",
      alt: "Surah Al-Fatihah 3",
      title: "Al-Fatihah 3",
    },
    {
      src: "/al-fatihah-4.jpg",
      alt: "Surah Al-Fatihah 4",
      title: "Al-Fatihah 4",
    },
    {
      src: "/al-fatihah-5.jpg",
      alt: "Surah Al-Fatihah 5",
      title: "Al-Fatihah 5",
    },
    {
      src: "/al-fatihah-6.jpg",
      alt: "Surah Al-Fatihah 6",
      title: "Al-Fatihah 6",
    },
  ];

  // Create placeholder divs for the images (you'll replace these with actual images)
  const createPlaceholderDiv = (index: number) => (
    <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center p-4">
        <div className="text-2xl font-bold text-gray-400 mb-2">
          Al-Fatihah {index + 1}
        </div>
        <p className="text-gray-400">Placeholder for Al-Fatihah image</p>
      </div>
    </div>
  );

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
      <div className="relative max-w-2xl mx-auto">
        {/* Main image container */}
        <div className="relative overflow-hidden rounded-lg shadow-md">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                {createPlaceholderDiv(index)}
                {/* Uncomment and use this when you have actual images:
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={450}
                  className="w-full h-64 object-contain"
                  priority={index === 0}
                />
                */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <h3 className="text-white text-sm font-medium text-center">
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
