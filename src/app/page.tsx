"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { ArrowRight } from "lucide-react";
import HeroCarousel from "./components/HeroCarousel";
import MissionStatementSection from "./components/MissionStatementSection";
import TakeActionSection from "./components/TakeActionSection";
import TouchingLivesSection from "./components/TouchingLivesSection";
import HowWeWorkSection from "./components/HowWeWorkSection";
import OurFaithSection from "./components/OurFaithSection";
import OurHistorySection from "./components/OurHistorySection";
import ImageGallerySection from "./components/ImageGallerySection";
import ImpactStatsSection from "./components/ImpactStatsSection";

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans bg-[#F5F5F5]">
      {/* --- HEADER --- */}
      <Header />

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

      {/* --- OUR HISTORY SECTION --- */}
      <OurHistorySection />

      {/* --- IMAGE GALLERY SECTION --- */}
      <ImageGallerySection />

      {/* --- IMPACT STATS SECTION --- */}
      {/* <ImpactStatsSection /> */}

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
      <Footer />
    </div>
  );
}
