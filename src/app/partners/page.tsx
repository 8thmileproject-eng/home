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
import Header from "../components/Header";
import Footer from "../components/Footer";

const partnerTypes = [
  {
    icon: Building2,
    title: "Corporate Partners",
    description:
      "Whether through financial support, shared resources, or professional expertise, your business can play a vital role in amplifying our impact and driving real change.",
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
      "Stand with us in faith. Your congregation can partner with our missions through dedicated prayer, generous giving, and by sending volunteers to the field.",
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
      "Let's learn and grow together. We collaborate with schools and universities on student support programs, impactful research, and hands-on service learning.",
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
      "Use your skills for good. We welcome individuals and firms willing to offer pro-bono services in healthcare, legal work, construction, and beyond.",
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
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/vp.jpg" alt="Partnership" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d2e]/90 via-[#1a3d2e]/50 to-transparent" />
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

        <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5]/80 to-transparent" />
      </section>

      {/* --- WHY PARTNER SECTION --- */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
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
      </section> */}

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
                            {/* <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: partner.accentColor }} />
                            <span className="text-gray-700 text-sm">{benefit}</span> */}
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
      <Footer />
    </div>
  );
}
