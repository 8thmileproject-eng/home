"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import HeroCarousel from "./components/HeroCarousel";
import MissionStatementSection from "./components/MissionStatementSection";
import TakeActionSection from "./components/TakeActionSection";
import TouchingLivesSection from "./components/TouchingLivesSection";
import HowWeWorkSection from "./components/HowWeWorkSection";
import OurFaithSection from "./components/OurFaithSection";
import ImpactStatsSection from "./components/ImpactStatsSection";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen font-sans bg-[#F5F5F5]">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-2 md:py-1 flex items-center justify-between bg-white/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
          <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
            <Image src="/logo.svg" alt="8th Mile Project" fill className="object-contain" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center bg-white rounded-full px-2 py-2 shadow-sm">
          {["Home", "Projects", "Partners", "Reporting", "Our Faith", "Contact"].map((item) => (
            <a
              key={item}
              href={
                item === "Home"
                  ? "/"
                  : item === "Our Faith"
                    ? "#our-faith"
                    : item === "Partners"
                      ? "/partners"
                      : item === "Reporting"
                        ? "/reporting"
                        : "#"
              }
              className={`px-4 lg:px-6 py-2 text-sm font-medium transition-all duration-300 rounded-full ${item === "Home" ? "bg-[#e8f0e8] text-[#1a3d2e]" : "text-gray-600 hover:text-[#1a3d2e]"
                }`}
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
              {["Home", "Projects", "Partners", "Reporting", "Our Faith", "Contact"].map((item) => (
                <a
                  key={item}
                  href={
                    item === "Home"
                      ? "/"
                      : item === "Our Faith"
                        ? "#our-faith"
                        : item === "Partners"
                          ? "/partners"
                          : item === "Reporting"
                            ? "/reporting"
                            : "#"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${item === "Home" ? "bg-[#e8f0e8] text-[#1a3d2e]" : "text-gray-600 hover:text-[#1a3d2e] hover:bg-gray-50"
                    }`}
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

      {/* --- HERO CAROUSEL SECTION --- */}
      <main className="relative min-h-screen pt-20 sm:pt-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pb-8 sm:pb-12">
        {/* Hero Container with rounded corners */}
        <div className="relative w-full h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] overflow-hidden">
          <HeroCarousel />
        </div>
      </main>

      {/* --- MISSION STATEMENT SECTION --- */}
      <MissionStatementSection />

      {/* --- TAKE ACTION SECTION --- */}
      <TakeActionSection />

      {/* --- TOUCHING LIVES SECTION --- */}
      <TouchingLivesSection />

      {/* --- HOW WE WORK SECTION --- */}
      <HowWeWorkSection />

      {/* --- OUR FAITH SECTION --- */}
      <OurFaithSection />

      {/* --- IMPACT STATS SECTION --- */}
      <ImpactStatsSection />

      {/* --- REPORTING SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a3d2e] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-xs font-bold tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
            Community Reporting
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            8thMile Reporting
          </h2>

          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-4">
            Do you know any community that needs urgent intervention?
          </p>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
            Help us identify communities in need. Your report can make a difference.
          </p>

          <a
            href="/reporting"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ade80] text-[#1a3d2e] rounded-full font-bold text-lg hover:bg-[#3ec46e] transition-all"
          >
            Report Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0f261c] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12">
                  <Image src="/logo.svg" alt="8th Mile Project" fill className="object-contain" />
                </div>
                <span className="text-white font-bold text-lg">8th Mile Project</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                The missions&apos; arm of YWAP, caring for people in need as instructed in Matthew 25:35-40.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", href: "/" },
                  { label: "About Us", href: "#" },
                  { label: "Our Projects", href: "#" },
                  { label: "Our Faith", href: "#our-faith" },
                  { label: "Contact", href: "#" }
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-white font-bold mb-6">Our Programs</h4>
              <ul className="space-y-3">
                {[
                  { label: "Medical Outreaches", href: "#touching-lives" },
                  { label: "Student Support", href: "#touching-lives" },
                  { label: "Back to School", href: "#touching-lives" },
                  { label: "Homes for Widows", href: "#touching-lives" },
                  { label: "Bible Donation", href: "#touching-lives" }
                ].map((program) => (
                  <li key={program.label}>
                    <a href={program.href} className="text-white/60 hover:text-white transition-colors text-sm">{program.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6">Contact Us</h4>
              <ul className="space-y-3 text-white/60 text-sm">
                <li><a href="mailto:info@8thmileproject.org" className="hover:text-white transition-colors">info@8thmileproject.org</a></li>
                <li><a href="tel:+2347039550499" className="hover:text-white transition-colors">+234 703 955 0499</a></li>
                <li>Kaduna, Nigeria</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">The 8th Mile Project © 2026. All rights reserved.</p>
            <div className="flex gap-6">
              {["Facebook", "Twitter", "Youtube"].map((social) => (
                <a key={social} href="#" className="text-white/40 hover:text-white transition-colors text-sm">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
