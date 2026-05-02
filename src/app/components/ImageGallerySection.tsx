"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

// You can add as many images as you want to this array!
const images = [
  // Page 1
  { src: "/hero1.jpg", alt: "Outreach activity 1" },
  { src: "/hero2.jpg", alt: "Outreach activity 2" },
  { src: "/hero3.jpg", alt: "Outreach activity 3" },
  { src: "/hero4.jpg", alt: "Outreach activity 4" },
  { src: "/pj.jpg", alt: "Outreach activity 5" },
  { src: "/hero6.jpg", alt: "Outreach activity 6" },
  
  // Page 2
  { src: "/vp.jpg", alt: "Outreach activity 7" },
  { src: "/bp.jpg", alt: "Outreach activity 8" },
  { src: "/fss.jpg", alt: "Outreach activity 9" },
  { src: "/sa.jpg", alt: "Outreach activity 10" },
  { src: "/md.jpg", alt: "Outreach activity 11" },
  { src: "/of.jpg", alt: "Outreach activity 12" },
];

// This creates an infinitely repeating "bento box" pattern
function getGridClasses(index: number) {
  const pattern = index % 6; // Repeats the layout every 6 images
  
  if (pattern === 0) return "md:col-span-2 md:row-span-2"; // Big square
  if (pattern === 5) return "md:col-span-4 md:row-span-1"; // Wide rectangle
  return "col-span-1 md:col-span-1 md:row-span-1";         // Small squares
}

export default function ImageGallerySection() {
  const [page, setPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const visibleImages = images.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <section className="py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
            <Camera className="w-4 h-4" />
            Moments
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Impact in Pictures
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A glimpse into the lives touched and communities transformed through our practical love initiatives.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          {visibleImages.map((img, index) => (
            <div 
              key={`${page}-${index}`} 
              className={`relative rounded-3xl overflow-hidden group w-full h-full cursor-pointer ${getGridClasses(index)}`}
              onClick={() => setSelectedImage(img.src)}
            >
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-[#1a3d2e]/0 group-hover:bg-[#1a3d2e]/40 transition-colors duration-500 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 scale-50 group-hover:scale-100 ease-out" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-12">
            <button 
              onClick={prevPage}
              disabled={page === 0}
              className={`p-4 rounded-full transition-all duration-300 ${page === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-[#1a3d2e] hover:bg-[#1a3d2e] hover:text-white shadow-md hover:shadow-xl'}`}
              aria-label="Previous images"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-bold text-gray-500">
              {page + 1} / {totalPages}
            </span>
            <button 
              onClick={nextPage}
              disabled={page === totalPages - 1}
              className={`p-4 rounded-full transition-all duration-300 ${page === totalPages - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-[#1a3d2e] hover:bg-[#1a3d2e] hover:text-white shadow-md hover:shadow-xl'}`}
              aria-label="Next images"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox / Image Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300" onClick={() => setSelectedImage(null)}>
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-[90vw] h-[80vh] max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={selectedImage} 
              alt="Full size view" 
              fill 
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
