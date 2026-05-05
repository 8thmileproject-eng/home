"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import {
  ArrowRight,
  Upload,
  AlertTriangle,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Play,
  HandHeart,
  Share2,
  Heart,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

export default function ReportingPage() {
  const [formData, setFormData] = useState({
    communityName: "",
    location: "",
    reporterName: "",
    phone: "",
    email: "",
    description: "",
    disclaimerAccepted: false,
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          communityName: "",
          location: "",
          reporterName: "",
          phone: "",
          email: "",
          description: "",
          disclaimerAccepted: false,
        });
        setUploadedImage(null);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
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
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Reporting" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d2e]/90 via-[#1a3d2e]/70 to-[#1a3d2e]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
              <span className="text-xs font-bold tracking-wider text-white uppercase">Community Reporting</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              8thMile
              <br />
              <span className="text-[#4ade80]">Reporting</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
              Help us identify communities that need urgent intervention. Your report can save lives.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F5F5] to-transparent" />
      </section>

      {/* --- REPORTING FORM SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
              Report a Community
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Do You Know Any Community That Needs Urgent Intervention?
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Community Name *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.communityName}
                      onChange={(e) => setFormData({ ...formData, communityName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                      placeholder="Enter community name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.reporterName}
                      onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                      placeholder="+234 000 000 0000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#2d5a3d] transition-colors cursor-pointer text-center"
                >
                  {uploadedImage ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image src={uploadedImage} alt="Uploaded" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImage(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
                      >
                        <span className="text-gray-600">×</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Click to upload an image</p>
                      <p className="text-gray-400 text-xs mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all resize-none"
                    placeholder="Describe the situation and needs of this community..."
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.disclaimerAccepted}
                      onChange={(e) => setFormData({ ...formData, disclaimerAccepted: e.target.checked })}
                      className="mt-1 w-4 h-4 text-[#2d5a3d] border-gray-300 rounded focus:ring-[#2d5a3d]"
                    />
                    <span className="text-sm text-gray-700">
                      By submitting this form, you consent to the fact that the information provided here by you can be used for outreaches and impact programs. You also attest that the information given here to the best of your knowledge is accurate and you can be contacted for further information regarding the information shared.
                    </span>
                  </label>
                </div>
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Thank you! Your report has been submitted successfully.
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
                    Submit Report
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
