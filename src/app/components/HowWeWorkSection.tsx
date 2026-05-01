import Image from "next/image";

export default function HowWeWorkSection() {
  return (
    <section className="py-24 px-8 md:px-16 lg:px-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden">
              <Image
                src="/hero.png"
                alt="Our Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-8 -right-8 bg-[#2d5a3d] text-white rounded-3xl p-8 shadow-2xl">
              <div className="text-6xl font-bold mb-2">15+</div>
              <div className="text-lg opacity-90">Years of<br />Service</div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
              HOW WE WORK
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Volunteer & Partnership Based
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              The 8th Mile is volunteer and partnership based, our objectives are realised
              through YWAP centres that are spread across Nigeria. We mobilize and connect
              the hearts, skills and resources of local and international partners who
              believe in our goals.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Mobilize Hearts & Skills",
                  description: "We mobilize and connect the hearts, skills and resources of local and international partners who believe in our goals."
                },
                {
                  title: "YWAP Network",
                  description: "Our objectives are realised through Youth With A Purpose (YWAP) centres that are spread across Nigeria."
                },
                {
                  title: "Long-lasting Empowerment",
                  description: "Our goal is to help alleviate human suffering in rural communities and urban slums through empowerment."
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 bg-[#2d5a3d] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/partners"
              className="mt-10 px-8 py-4 border-2 border-[#2d5a3d] text-[#2d5a3d] rounded-full font-semibold hover:bg-[#2d5a3d] hover:text-white transition-all inline-flex items-center gap-2"
            >
              Become a Partner
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
