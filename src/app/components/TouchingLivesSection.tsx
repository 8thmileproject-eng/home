import { Stethoscope, Shirt, GraduationCap, School, Home, BookOpen } from "lucide-react";

const focusAreas = [
  {
    icon: Stethoscope,
    title: "Rural Medical",
    subtitle: "Outreaches",
    description: "Providing free medical services, clothing, and food items to needy communities.",
    bgColor: "#ecfdf5",
    accentColor: "#059669"
  },
  {
    icon: Shirt,
    title: "Clothing",
    subtitle: "The Naked",
    description: "Following the instruction in Matthew 25:36: 'I was naked and you clothed me'.",
    bgColor: "#eff6ff",
    accentColor: "#2563eb"
  },
  {
    icon: GraduationCap,
    title: "Students",
    subtitle: "Assistance",
    description: "Mobilizing resources to provide educational support to students in need.",
    bgColor: "#fffbeb",
    accentColor: "#d97706"
  },
  {
    icon: School,
    title: "Back to School",
    subtitle: "Program",
    description: "Breaking cycles of poverty by equipping children with school essentials.",
    bgColor: "#faf5ff",
    accentColor: "#9333ea"
  },
  {
    icon: Home,
    title: "Habitable Homes",
    subtitle: "for Widows",
    description: "Building safe and dignifying shelter for vulnerable widows in rural areas.",
    bgColor: "#fff1f2",
    accentColor: "#e11d48"
  },
  {
    icon: BookOpen,
    title: "Bibles for",
    subtitle: "Rural Churches",
    description: "Donation of Bibles in local languages to strengthen rural churches.",
    bgColor: "#eef2ff",
    accentColor: "#4f46e5"
  }
];

export default function TouchingLivesSection() {
  return (
    <section className="py-24 px-8 md:px-16 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
              OUR WORK
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Touching Lives, <br />
              <span className="text-[#2d5a3d]">Making Impact</span>
            </h2>
          </div>

          <div className="flex items-end">
            <p className="text-lg text-gray-600 leading-relaxed">
              Started in January 2006 in Kaduna, we have been touching lives for over 15 years,
              mobilizing and connecting hearts and skills to alleviate human suffering.
            </p>
          </div>
        </div>

        {/* Focus Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((area) => {
            const IconComponent = area.icon;
            return (
              <div
                key={area.title}
                className="group relative overflow-hidden rounded-3xl p-8 cursor-pointer hover:scale-[1.02] transition-all duration-500"
                style={{ backgroundColor: area.bgColor }}
              >
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-[#2d5a3d]" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {area.title}
                  </h3>

                  <p className="text-xl font-semibold mb-3" style={{ color: area.accentColor }}>
                    {area.subtitle}
                  </p>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <a href="/projects" className="px-8 py-4 bg-[#2d5a3d] text-white rounded-full font-semibold hover:bg-[#1e3d2a] transition-colors inline-flex items-center gap-2">
            View All Projects
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
