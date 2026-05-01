const stats = [
  {
    number: "200+",
    label: "Medical Outreaches",
    description: "Free healthcare services provided"
  },
  {
    number: "5,000+",
    label: "Children Supported",
    description: "With education and school supplies"
  },
  {
    number: "50+",
    label: "Homes Built",
    description: "For widows and vulnerable families"
  },
  {
    number: "10,000+",
    label: "Bibles Donated",
    description: "To rural churches across Nigeria"
  },
  {
    number: "100+",
    label: "Communities",
    description: "Served across rural Nigeria"
  },
  {
    number: "500+",
    label: "Volunteers",
    description: "Mobilized for outreaches"
  }
];

export default function ImpactStatsSection() {
  return (
    <section className="py-20 px-8 md:px-16 lg:px-24 bg-[#1a3d2e]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-xs font-bold tracking-wider uppercase mb-6">
            OUR IMPACT
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Numbers That Tell Our Story
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Since our start in 2006, our dedicated service has created lasting change across communities in Nigeria.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-white/90 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-white/60">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
