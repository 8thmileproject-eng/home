import Image from "next/image";
import { Clock } from "lucide-react";

export default function OurHistorySection() {
  return (
    <section className="py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Content Side */}
          <div className="w-full lg:w-1/2 space-y-8 relative z-10">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
                <Clock className="w-4 h-4" />
                Since 2006
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Our History
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed relative pl-6">
              <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-[#4ade80] to-[#1a3d2e]/10 rounded-full" />
              <p>
                The 8th mile started in January 2006 as Youth With A Purpose (YWAP) practical love initiative in Kaduna Nigeria. Free medical services, clothing, food items, Insecticide treated mosquito nets were given to the people of Bugai community.
              </p>
              <p className="font-semibold text-gray-900 bg-[#F5F5F5] p-6 rounded-2xl border border-gray-100">
                Till this day, all 8th mile outreaches, activities and resources are coordinated and managed by members of YWAP.
              </p>
            </div>
          </div>

          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-[#1a3d2e]/5 rounded-[3rem] transform -rotate-3 transition-transform hover:rotate-0 duration-500" />
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl group">
              <Image 
                src="/vp.jpg" 
                alt="Our History - YWAP" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d2e]/90 via-[#1a3d2e]/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/20">
                  <p className="font-bold text-2xl mb-2">Youth With A Purpose</p>
                  <p className="text-white/80 font-medium tracking-wide text-sm uppercase">Practical love initiative</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
