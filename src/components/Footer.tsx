"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pb-6">
      <div className="border-t border-gray-700 mt-8 pt-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Welcome
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            مرحبا
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            স্বাগতম
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            خوش آمدید
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm mt-2">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact us
          </a>
        </div>
      </div>
    </footer>
  );
}
