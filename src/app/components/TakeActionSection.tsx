import { Play, HandHeart, Share2, HeartHandshake } from "lucide-react";

const actions = [
  {
    icon: Play,
    title: "Pray",
    description: "Pray for us and for our teams and efforts.",
    color: "bg-[#e8f0e8]",
    iconColor: "text-[#2d5a3d]"
  },
  {
    icon: HandHeart,
    title: "Volunteer",
    description: "Find out about upcoming events that need your help.",
    color: "bg-[#f0e8e8]",
    iconColor: "text-[#8b4513]"
  },
  {
    icon: Share2,
    title: "Share",
    description: "Use your social media networks to spread the word about us.",
    color: "bg-[#e8e8f0]",
    iconColor: "text-[#4a4a8a]"
  },
  {
    icon: HeartHandshake,
    title: "Donate",
    description: "Help us raise funds to make a big difference.",
    color: "bg-[#f0f0e8]",
    iconColor: "text-[#6b6b2d]"
  }
];

export default function TakeActionSection() {
  return (
    <section className="py-20 px-8 md:px-16 lg:px-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
            GET INVOLVED
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Take Action
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            There are many ways to be part of our mission. Choose how you want to make a difference today.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div
                key={action.title}
                className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 ${action.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {action.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {action.description}
                </p>

                <a href="/partners" className="text-[#2d5a3d] font-semibold text-sm flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                  Learn More
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12,5 19,12 12,19" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
