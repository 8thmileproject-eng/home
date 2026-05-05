"use client";

import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-2 md:py-1 flex items-center justify-between bg-white/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 md:gap-3 group cursor-pointer">
        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
          <Image src="/logo.svg" alt="8th Mile Project" fill className="object-contain" />
        </div>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center bg-white rounded-full px-2 py-2 shadow-sm">
        {["Home", "Projects", "Partners", "Reporting", "Our Faith", "Volunteer", "Contact"].map((item) => (
          <a
            key={item}
            href={
              item === "Home"
                ? "/"
                : item === "Our Faith"
                  ? "/our-faith"
                  : item === "Partners"
                    ? "/partners"
                    : item === "Projects"
                      ? "/projects"
                      : item === "Reporting"
                        ? "/reporting"
                        : item === "Volunteer"
                          ? "/volunteer"
                          : "#"
            }
            className={`px-4 lg:px-6 py-2 text-sm font-medium transition-all duration-300 rounded-full text-gray-600 hover:text-[#1a3d2e]`}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Desktop Donate Button */}
      <a
        href="/donate"
        className="hidden bg-white md:block px-6 lg:px-8 py-2.5 lg:py-3 text-sm font-semibold border-2 border-[#ffffff] text-[#1a3d2e] rounded-full hover:bg-[#1a3d2e] hover:text-white transition-all duration-300"
      >
        Donate Now
      </a>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {mobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden py-4 px-4">
          <nav className="flex flex-col gap-2">
            {["Home", "Projects", "Partners", "Reporting", "Our Faith", "Volunteer", "Contact"].map((item) => (
              <a
                key={item}
                href={
                  item === "Home"
                    ? "/"
                    : item === "Our Faith"
                      ? "/our-faith"
                      : item === "Partners"
                        ? "/partners"
                        : item === "Projects"
                          ? "/projects"
                          : item === "Reporting"
                            ? "/reporting"
                            : item === "Volunteer"
                              ? "/volunteer"
                              : "#"
                }
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg text-gray-600 hover:text-[#1a3d2e] hover:bg-gray-50`}
              >
                {item}
              </a>
            ))}
            <a
              href="/donate"
              className="mt-2 w-full px-4 py-3 text-sm font-semibold bg-[#1a3d2e] text-white rounded-lg hover:bg-[#143324] transition-all duration-300 text-center block"
            >
              Donate Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
