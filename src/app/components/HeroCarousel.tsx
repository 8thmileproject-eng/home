"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

interface Slide {
  id: number;
  image: string;
  tag: string;
  headline: string;
  description: string;
  badges: string[];
  cardTitle: string;
  cardDescription: string;
  cardButton: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/hero6.jpg",
    tag: "GOING THE EXTRA MILE",
    headline: "Caring for People\nin Need as Christ Instructed",
    description: "The 8th Mile is the missions' arm of YWAP. We help alleviate human suffering in rural communities and urban slums as instructed in Matthew 25:35-40.",
    badges: ["Missions arm of YWAP", "Matthew 25:35-40"],
    cardTitle: "Make an Immediate\nImpact",
    cardDescription: "Your donation helps us bring hope and restoration to underserved communities across Nigeria.",
    cardButton: "Become Our Partner"
  },
  {
    id: 2,
    image: "/hero.png",
    tag: "RURAL MEDICAL OUTREACHES",
    headline: "Free Medical Services\nto the Sick",
    description: "We provide mobile clinical services, health education, and free medication to rural dwellers with limited access to healthcare.",
    badges: ["Free Medical Services", "Rural Outreaches"],
    cardTitle: "Support Medical\nOutreaches",
    cardDescription: "Help us reach more communities with essential life-saving medical care and supplies.",
    cardButton: "Fund Healthcare"
  },
  {
    id: 3,
    image: "/hero.png",
    tag: "EMPOWERMENT & EDUCATION",
    headline: "Breaking Poverty\nThrough Student Support",
    description: "Through our Back to School programs and student assistance, we equip the next generation for a brighter future.",
    badges: ["Student Assistance", "Back to School"],
    cardTitle: "Invest in\nthe Future",
    cardDescription: "Your support provides school uniforms, books, and tuition for children in rural communities.",
    cardButton: "Support Education"
  },
  {
    id: 4,
    image: "/hero.png",
    tag: "PRACTICAL LOVE IN ACTION",
    headline: "Building Homes\nand Restoring Dignity",
    description: "We build habitable homes for widows and provide bibles in local languages to rural churches across Nigeria.",
    badges: ["Homes for Widows", "Bible Donation"],
    cardTitle: "Join Our\nMission",
    cardDescription: "Partner with us as we mobilize skills and resources to reach the unreached with practical love.",
    cardButton: "Get Involved"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Slides Container */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="relative w-full h-full flex-shrink-0"
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.headline}
              fill
              className="object-cover"
              priority={index === 0}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Bottom gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content Container - Stacked on mobile, side by side on desktop */}
            <div className="absolute inset-0 flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
              {/* Left Content */}
              <div
                className={`flex flex-col justify-end pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6 lg:pl-20 transition-all duration-700 delay-200 ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
              >
                {/* Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-full mb-4 sm:mb-6 w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#1a3d2e]" />
                  <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#1a3d2e] uppercase">{slide.tag}</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-4 sm:mb-6">
                  {slide.headline.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < slide.headline.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h1>

                {/* Description */}
                <p className="text-white/90 text-base sm:text-lg max-w-lg leading-relaxed">
                  {slide.description}
                </p>
              </div>

              {/* Right Content - Hidden on mobile, visible on lg screens */}
              <div
                className={`hidden lg:flex relative flex-col items-end justify-center pr-12 lg:pr-20 transition-all duration-700 delay-300 ${currentSlide === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
              >
                {/* Feature Badges */}
                <div className="flex flex-col gap-4 mb-8">
                  {slide.badges.map((badge, badgeIndex) => (
                    <div
                      key={badgeIndex}
                      className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white flex items-center gap-3"
                      style={{
                        transitionDelay: currentSlide === index ? `${400 + badgeIndex * 100}ms` : '0ms',
                        opacity: currentSlide === index ? 1 : 0,
                        transform: currentSlide === index ? 'translateX(0)' : 'translateX(20px)',
                        transition: 'all 0.5s ease-out'
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
                      <span className="text-sm font-medium">{badge}</span>
                    </div>
                  ))}
                </div>

                {/* Floating Card */}
                <div
                  className="bg-white rounded-3xl p-8 w-full max-w-[360px] shadow-2xl"
                  style={{
                    opacity: currentSlide === index ? 1 : 0,
                    transform: currentSlide === index ? 'scale(1)' : 'scale(0.9)',
                    transition: 'all 0.6s ease-out 0.5s'
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8">
                        <Image src="/logo.png" alt="logo" fill className="object-contain" />
                      </div>
                      <span className="text-sm font-bold text-[#1a3d2e]">8th Mile Project</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-gray-400">●</span>
                      <span className="text-sm font-bold text-gray-900">Est. 2006</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-[#e8f0e8] flex items-center justify-center mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                      <line x1="8" y1="6" x2="8" y2="6" />
                      <line x1="16" y1="6" x2="16" y2="6" />
                      <line x1="8" y1="10" x2="8" y2="10" />
                      <line x1="16" y1="10" x2="16" y2="10" />
                    </svg>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {slide.cardTitle.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < slide.cardTitle.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </h3>

                  {/* Card Description */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    {slide.cardDescription}
                  </p>

                  {/* Card Button */}
                  <a
                    href={slide.cardButton === "Become Our Partner" ? "/partners" : "#"}
                    className="block w-full py-4 bg-[#2d5a3d] text-white rounded-2xl font-semibold hover:bg-[#1e3d2a] transition-colors text-center"
                  >
                    {slide.cardButton}
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile CTA Button - Only visible on mobile */}
            <div className="lg:hidden absolute bottom-24 left-4 right-4">
              <a
                href={slide.cardButton === "Become Our Partner" ? "/partners" : "#"}
                className="block w-full py-3.5 bg-[#2d5a3d] text-white rounded-xl font-semibold text-base shadow-lg active:scale-[0.98] transition-transform text-center"
              >
                {slide.cardButton}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on sm and up */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/30 transition-all z-20"
        aria-label="Previous slide"
      >
        <svg width="20" height="20" className="lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/30 transition-all z-20"
        aria-label="Next slide"
      >
        <svg width="20" height="20" className="lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-16 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-white w-6 sm:w-8"
              : "bg-white/40 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
