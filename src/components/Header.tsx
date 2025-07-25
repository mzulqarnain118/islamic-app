"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";
import logo from "@/public/logo.png";
// import Image from "next/image";

interface PrayerTime {
  name: string;
  time: string;
}

export default function Header() {
  const [location, setLocation] = useState("Loading...");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Get current date
    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    // Get user location and prayer times
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Fetch prayer times from Islamic Finder API
            const response = await fetch(
              `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
            );
            const data = await response.json();

            if (data.data) {
              const timings = data.data.timings;
              setPrayerTimes([
                { name: "Fajr", time: timings.Fajr },
                { name: "Dhuhr", time: timings.Dhuhr },
                { name: "Asr", time: timings.Asr },
                { name: "Maghrib", time: timings.Maghrib },
                { name: "Isha", time: timings.Isha },
              ]);
            }

            // Get location name
            const locationResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const locationData = await locationResponse.json();
            setLocation(`${locationData.city}, ${locationData.countryName}`);
          } catch (error) {
            console.error("Error fetching prayer times:", error);
            setLocation("Location unavailable");
          }
        },
        () => {
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 text-center">
        <div className="flex-col justify-center items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 justify-center">
            {/* <Image src={logo} alt="Quran Logo" width={100} height={100} /> */}
            <span className="text-xl font-bold text-gray-800">Quran</span>
          </div>

          {/* Prayer Times and Location */}
          <div className="flex-col items-center space-x-6 justify-center">
            <div className="flex items-center space-x-2 mt-4 justify-center">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{location}</span>
            </div>

            <div className="flex items-center space-x-2 mt-4 justify-center">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{currentDate}</span>
            </div>

            {prayerTimes.length > 0 && (
              <div className="hidden md:flex items-center space-x-4 justify-center mt-4">
                {prayerTimes.map((prayer) => (
                  <div key={prayer.name} className="text-center">
                    <div className="text-xs text-gray-500">{prayer.name}</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {prayer.time}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
