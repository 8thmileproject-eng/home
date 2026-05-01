import Image from "next/image";

export default function MissionStatementSection() {
    return (
        <section className="py-20 px-8 md:px-16 lg:px-24 bg-[#E8F0E6] overflow-hidden relative border-y border-[#D1DFD1]">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-8 animate-fade-in shadow-sm">
                    <div className="relative w-5 h-5">
                        <Image src="/logo.svg" alt="logo" fill className="object-contain" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#1a3d2e] uppercase">Our Commission</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-[#1a3d2e] leading-[1.2] mb-8 animate-slide-up">
                    The 8th Mile is the missions’ arm of <br className="hidden md:block" />
                    <span className="text-[#2d5a43] italic">Youth with A Purpose (YWAP).</span>
                </h2>

                <p className="text-lg md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in-delayed font-medium">
                    Through our outreaches and projects, we care for people in need as instructed
                    by our Lord Jesus Christ in <span className="text-[#1a3d2e] font-bold border-b-2 border-[#1a3d2e]/20">Matthew 25:35-40</span>.
                </p>
            </div>

            {/* Subtle decorative background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        </section>
    );
}
