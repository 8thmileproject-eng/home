"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Heart,
  Users,
  Globe,
  HandHeart,
  ArrowRight,
  CheckCircle2,
  Building2,
  Church,
  GraduationCap,
  Briefcase,
  Play,
  Share2,
} from "lucide-react";

const partnerTypes = [
  {
    icon: Building2,
    title: "Corporate Partners",
    description:
      "Businesses and organizations that provide financial support, resources, and expertise to amplify our impact.",
    benefits: [
      "Brand visibility across our outreach programs",
      "Employee volunteer opportunities",
      "CSR alignment and reporting",
    ],
    color: "bg-[#e8f0e8]",
    iconColor: "text-[#2d5a3d]",
    accentColor: "#2d5a3d",
  },
  {
    icon: Church,
    title: "Church Partners",
    description:
      "Local and international churches that pray, give, and send volunteers to support our mission outreaches.",
    benefits: [
      "Mission trip coordination",
      "Joint community programs",
      "Prayer network access",
    ],
    color: "bg-[#f0e8e8]",
    iconColor: "text-[#8b4513]",
    accentColor: "#8b4513",
  },
  {
    icon: GraduationCap,
    title: "Academic Partners",
    description:
      "Schools and universities that collaborate on student support programs, research, and service learning.",
    benefits: [
      "Student internship programs",
      "Research collaboration",
      "Service learning credits",
    ],
    color: "bg-[#e8e8f0]",
    iconColor: "text-[#4a4a8a]",
    accentColor: "#4a4a8a",
  },
  {
    icon: Briefcase,
    title: "Professional Partners",
    description:
      "Individuals and firms offering pro-bono services in healthcare, legal, construction, and more.",
    benefits: [
      "Skill-based volunteering",
      "Professional network expansion",
      "Community recognition",
    ],
    color: "bg-[#f0f0e8]",
    iconColor: "text-[#6b6b2d]",
    accentColor: "#6b6b2d",
  },
];

const actions = [
  {
    icon: Play,
    title: "Pray",
    description: "Pray for us and for our teams and efforts.",
    color: "bg-[#e8f0e8]",
    iconColor: "text-[#2d5a3d]",
  },
  {
    icon: HandHeart,
    title: "Volunteer",
    description: "Find out about upcoming events that need your help.",
    color: "bg-[#f0e8e8]",
    iconColor: "text-[#8b4513]",
  },
  {
    icon: Share2,
    title: "Share",
    description: "Use your social media networks to spread the word about us.",
    color: "bg-[#e8e8f0]",
    iconColor: "text-[#4a4a8a]",
  },
  {
    icon: Heart,
    title: "Donate",
    description: "Help us raise funds to make a big difference.",
    color: "bg-[#f0f0e8]",
    iconColor: "text-[#6b6b2d]",
  },
];

export default function PartnersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    partnershipType: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          birthday: "",
          partnershipType: "",
          description: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans bg-[#F5F5F5]">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-2 md:py-1 flex items-center justify-between bg-white/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
          <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
            <Image src="/logo.svg" alt="8th Mile Project" fill className="object-contain" />
          </div>
        </div>

        <nav className="hidden md:flex items-center bg-white rounded-full px-2 py-2 shadow-sm">
          {["Home", "Projects", "Partners", "Our Faith", "Contact"].map((item) => (
            <a
              key={item}
              href={item === "Home" ? "/" : item === "Our Faith" ? "/#our-faith" : item === "Partners" ? "/partners" : "#"}
              className={`px-4 lg:px-6 py-2 text-sm font-medium transition-all duration-300 rounded-full ${item === "Partners" ? "bg-[#e8f0e8] text-[#1a3d2e]" : "text-gray-600 hover:text-[#1a3d2e]"}`}
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          href="/donate"
          className="hidden bg-white md:block px-6 lg:px-8 py-2.5 lg:py-3 text-sm font-semibold border-2 border-[#ffffff] text-[#1a3d2e] rounded-full hover:bg-[#1a3d2e] hover:text-white transition-all duration-300"
        >
          Donate Now
        </a>

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

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden py-4 px-4">
            <nav className="flex flex-col gap-2">
              {["Home", "Projects", "Partners", "Our Faith", "Contact"].map((item) => (
                <a
                  key={item}
                  href={item === "Home" ? "/" : item === "Our Faith" ? "/#our-faith" : item === "Partners" ? "/partners" : "#"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${item === "Partners" ? "bg-[#e8f0e8] text-[#1a3d2e]" : "text-gray-600 hover:text-[#1a3d2e] hover:bg-gray-50"}`}
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

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Partnership" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d2e]/90 via-[#1a3d2e]/70 to-[#1a3d2e]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
              <span className="text-xs font-bold tracking-wider text-white uppercase">Partnership Opportunities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Become Our
              <br />
              <span className="text-[#4ade80]">Partner</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
              Join hands with The 8th Mile Project to create lasting change in rural communities across Nigeria.
            </p>

            <a
              href="#partner-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ade80] text-[#1a3d2e] rounded-full font-bold text-lg hover:bg-[#3ec46e] transition-all"
            >
              Partner With Us
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F5F5] to-transparent" />
      </section>

      {/* --- WHY PARTNER SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
              Why Partner With Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Together We Can Do More
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Meaningful Impact", description: "Your partnership directly translates to lives changed through medical care, education, and shelter." },
              { icon: Users, title: "Network Access", description: "Connect with a diverse network of like-minded organizations committed to social good." },
              { icon: Globe, title: "Community Reach", description: "Extend your organization's footprint to rural communities across Nigeria." },
              { icon: HandHeart, title: "Shared Purpose", description: "Align with a mission rooted in faith and service, creating purpose-driven collaboration." },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.title} className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="w-16 h-16 bg-[#e8f0e8] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-[#2d5a3d]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- PARTNER TYPES SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
              Partnership Types
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How You Can Partner
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerTypes.map((partner) => {
              const IconComponent = partner.icon;
              return (
                <div key={partner.title} className="group bg-[#F5F5F5] rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 ${partner.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${partner.iconColor}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{partner.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{partner.description}</p>

                      <div className="space-y-3">
                        {partner.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: partner.accentColor }} />
                            <span className="text-gray-700 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- PARTNER FORM SECTION --- */}
      <section id="partner-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a3d2e]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-xs font-bold tracking-wider uppercase mb-6">
              Get Started
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Partner With Us
            </h2>
            <p className="text-lg text-white/70">
              Fill out the form below and we&apos;ll get back to you within 48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                    placeholder="+234 000 000 0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Type *</label>
                <select
                  required
                  value={formData.partnershipType}
                  onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select Partnership Type</option>
                  <option value="corporate">Corporate Partner</option>
                  <option value="church">Church Partner</option>
                  <option value="academic">Academic Partner</option>
                  <option value="professional">Professional Partner</option>
                  <option value="individual">Individual Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your organization and how you would like to partner with us..."
                />
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center">
                  Thank you! Your application has been submitted successfully. We&apos;ll get back to you within 48 hours.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center">
                  Something went wrong. Please try again or contact us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#2d5a3d] text-white rounded-2xl font-semibold hover:bg-[#1e3d2a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* --- TAKE ACTION SECTION --- */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
              GET INVOLVED
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Take Action
            </h2>
          </div>

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

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{action.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0f261c] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
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

            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", href: "/" },
                  { label: "About Us", href: "#" },
                  { label: "Our Projects", href: "#" },
                  { label: "Our Faith", href: "/#our-faith" },
                  { label: "Contact", href: "#" }
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Our Programs</h4>
              <ul className="space-y-3">
                {[
                  { label: "Medical Outreaches", href: "/#touching-lives" },
                  { label: "Student Support", href: "/#touching-lives" },
                  { label: "Back to School", href: "/#touching-lives" },
                  { label: "Homes for Widows", href: "/#touching-lives" },
                  { label: "Bible Donation", href: "/#touching-lives" }
                ].map((program) => (
                  <li key={program.label}>
                    <a href={program.href} className="text-white/60 hover:text-white transition-colors text-sm">{program.label}</a>
                  </li>
                ))}
              </ul>
            </div>

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
