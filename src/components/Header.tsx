"use client";

import { Fragment, useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Menu,
  X,
  Settings,
  Share2,
  Bookmark,
  Info,
  HelpCircle,
} from "lucide-react";
import { Menu as HeadlessMenu, MenuItem, Transition } from "@headlessui/react";
import Image from "next/image";
import logo from "../../public/logo.png";

interface PrayerTime {
  name: string;
  time: string;
}

function MenuButton({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <HeadlessMenu>
      <MenuItem>
        {({ active }) => (
          <button
            className={`${
              active ? "bg-gray-100 text-gray-900" : "text-gray-700"
            } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
          >
            <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
            {text}
          </button>
        )}
      </MenuItem>
    </HeadlessMenu>
  );
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
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Top bar with menu button and logo */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Image
              src={logo}
              alt="Quran Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-bold text-gray-800">Quran</span>
          </div>

          <HeadlessMenu as="div" className="relative">
            <div>
              <HeadlessMenu.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </HeadlessMenu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-1 py-1">
                  <MenuButton icon={Settings} text="Settings" />
                  <MenuButton icon={Share2} text="Share" />
                  <MenuButton icon={Bookmark} text="Bookmark" />
                  <MenuButton icon={Info} text="About Us" />
                  <MenuButton icon={HelpCircle} text="Help" />
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>

        <div className="flex-col justify-center items-center">
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
