"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Heart,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  Users,
  Stethoscope,
  GraduationCap,
  Home,
  BookOpen,
  Gift,
  Repeat,
  Lock,
  CreditCard,
  Calendar,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const impactAmounts = [
  { amount: 5000, label: "₦5,000", impact: "Provides school supplies for 2 children", icon: GraduationCap },
  { amount: 10000, label: "₦10,000", impact: "Feeds a family for 2 weeks", icon: Heart },
  { amount: 25000, label: "₦25,000", impact: "Medical checkup for 5 people", icon: Stethoscope },
  { amount: 50000, label: "₦50,000", impact: "Builds a home for a widow", icon: Home },
  { amount: 100000, label: "₦100,000", impact: "Sponsors a student for a year", icon: BookOpen },
  { amount: 0, label: "Custom", impact: "Any amount helps", icon: Gift },
];

const donationStats = [
  { number: "₦50M+", label: "Raised", description: "In donations since 2006" },
  { number: "10,000+", label: "Donors", description: "Generous supporters worldwide" },
  { number: "100%", label: "Transparent", description: "Every naira accounted for" },
  { number: "200+", label: "Communities", description: "Reached through your giving" },
];

const testimonials = [
  {
    quote: "Giving to The 8th Mile Project has been the most rewarding experience. Seeing the direct impact on communities keeps me donating every month.",
    author: "Chioma Adeleke",
    role: "Monthly Donor since 2020",
    amount: "₦25,000/month",
  },
  {
    quote: "I sponsored a student's education and received updates about their progress. It's amazing to see how a small contribution changes lives.",
    author: "Emmanuel Okafor",
    role: "Corporate Partner",
    amount: "₦100,000",
  },
  {
    quote: "The transparency and regular updates give me confidence that my donations are making a real difference in rural communities.",
    author: "Dr. Sarah Williams",
    role: "Medical Outreach Sponsor",
    amount: "₦50,000",
  },
];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(10000);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly" | "quarterly" | "yearly">("once");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    isAnonymous: false,
    coverFees: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const getFinalAmount = () => {
    const base = selectedAmount === 0 ? parseInt(customAmount) || 0 : selectedAmount;
    const fee = formData.coverFees ? base * 0.025 : 0;
    return base + fee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: getFinalAmount(),
          frequency,
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "", isAnonymous: false, coverFees: false });
        setSelectedAmount(10000);
        setCustomAmount("");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
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
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/do.jpg" alt="Donate" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b " />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6">
              <Heart className="w-4 h-4 text-[#4ade80]" />
              <span className="text-xs font-bold tracking-wider text-white uppercase">Make a Difference Today</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Your Giving
              <br />
              <span className="text-[#4ade80]">Changes Lives</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Every donation, no matter the size, directly impacts communities in need.
              Join thousands of donors making a difference across Nigeria.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#donate-form"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4ade80] text-[#1a3d2e] rounded-full font-bold text-lg hover:bg-[#3ec46e] transition-all"
              >
                Donate Now
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#impact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
              >
                See Your Impact
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F5F5] to-transparent" />
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {donationStats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-[#1a3d2e] mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DONATION FORM SECTION --- */}
      <section id="donate-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Impact Info */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
                  Your Impact
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Choose Your Impact
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Select an amount to see the direct impact of your donation. Every contribution
                  brings hope and transformation to communities in need.
                </p>
              </div>

              <div className="space-y-4">
                {impactAmounts.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = selectedAmount === item.amount;
                  return (
                    <button
                      key={item.amount}
                      onClick={() => {
                        setSelectedAmount(item.amount);
                        if (item.amount !== 0) setCustomAmount("");
                      }}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left flex items-center gap-4 ${isSelected
                        ? "border-[#2d5a3d] bg-[#e8f0e8] shadow-lg"
                        : "border-gray-200 hover:border-[#2d5a3d]/50 hover:bg-gray-50"
                        }`}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#2d5a3d] text-white" : "bg-gray-100 text-gray-600"
                        }`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-2xl font-bold text-gray-900">{item.label}</span>
                          {isSelected && <CheckCircle2 className="w-6 h-6 text-[#2d5a3d]" />}
                        </div>
                        <span className="text-sm text-gray-600">{item.impact}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedAmount === 0 && (
                <div className="p-6 bg-[#e8f0e8] rounded-2xl border-2 border-[#2d5a3d]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter Custom Amount (₦)</label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-3 text-2xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                    placeholder="Enter amount"
                    min="100"
                  />
                </div>
              )}

              <div className="p-6 bg-gray-50 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-4">Donation Frequency</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "once" as const, label: "One-time", icon: Gift },
                    { value: "monthly" as const, label: "Monthly", icon: Repeat },
                    { value: "quarterly" as const, label: "Quarterly", icon: Zap },
                    { value: "yearly" as const, label: "Yearly", icon: Calendar },
                  ].map((freq) => {
                    const IconComponent = freq.icon;
                    return (
                      <button
                        key={freq.value}
                        onClick={() => setFrequency(freq.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${frequency === freq.value
                          ? "border-[#2d5a3d] bg-[#e8f0e8]"
                          : "border-gray-200 hover:border-[#2d5a3d]/50"
                          }`}
                      >
                        <IconComponent className={`w-5 h-5 ${frequency === freq.value ? "text-[#2d5a3d]" : "text-gray-400"}`} />
                        <span className={`text-sm font-semibold ${frequency === freq.value ? "text-[#2d5a3d]" : "text-gray-600"}`}>
                          {freq.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Donation</h3>
                <p className="text-gray-600">Secure and encrypted payment processing</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 bg-[#1a3d2e] rounded-2xl text-white mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Donation Amount</span>
                    <span className="text-3xl font-bold">
                      ₦{getFinalAmount().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">{frequency === "once" ? "One-time" : `${frequency} donation`}</span>
                    {formData.coverFees && (
                      <span className="text-[#4ade80]">Includes processing fees</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all resize-none"
                      placeholder="Add a personal message..."
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                      className="mt-1 w-4 h-4 text-[#2d5a3d] border-gray-300 rounded focus:ring-[#2d5a3d]"
                    />
                    <span className="text-sm text-gray-700">Make this donation anonymous</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.coverFees}
                      onChange={(e) => setFormData({ ...formData, coverFees: e.target.checked })}
                      className="mt-1 w-4 h-4 text-[#2d5a3d] border-gray-300 rounded focus:ring-[#2d5a3d]"
                    />
                    <span className="text-sm text-gray-700">
                      I&apos;d like to cover the processing fees (2.5%) so 100% of my donation goes to the cause
                    </span>
                  </label>
                </div>

                {submitStatus === "success" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Thank you for your generous donation! A confirmation email has been sent.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center">
                    Something went wrong. Please try again or contact us.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || getFinalAmount() <= 0}
                  className="w-full py-4 bg-[#2d5a3d] text-white rounded-2xl font-semibold hover:bg-[#1e3d2a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Donate ₦{getFinalAmount().toLocaleString()}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Secure
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    Encrypted
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    PCI Compliant
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
              Donor Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Our Donors Give
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
              <div className="text-center">
                <svg className="w-10 h-10 text-[#2d5a3d]/20 mb-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                </p>

                <div className="mb-4">
                  <div className="font-bold text-gray-900 text-lg">{testimonials[activeTestimonial].author}</div>
                  <div className="text-[#2d5a3d] text-sm">{testimonials[activeTestimonial].role}</div>
                  <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-[#e8f0e8] rounded-full text-xs font-semibold text-[#2d5a3d]">
                    <Heart className="w-3 h-3" />
                    {testimonials[activeTestimonial].amount}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial
                    ? "bg-[#2d5a3d] w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a3d2e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Secure",
                description: "Your payment information is encrypted and never stored on our servers.",
              },
              {
                icon: Users,
                title: "Tax Deductible",
                description: "All donations are tax deductible. You'll receive a receipt for your records.",
              },
              {
                icon: Zap,
                title: "Instant Impact",
                description: "Your donation is immediately put to work helping communities in need.",
              },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-[#4ade80]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
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
