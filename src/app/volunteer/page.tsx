"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { volunteerRoles } from "./roles";
import { StepSelectRole, StepRoleDetails, StepPersonalInfo, StepRoleQuestions, StepFinal } from "./WizardSteps";

const STEPS = ["Select Role", "Role Details", "Personal Info", "Role Questions", "Submit"];

export default function VolunteerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeRole = volunteerRoles.find(r => r.id === selectedRole) || null;

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0 && !selectedRole) { errs._role = "Please select a role"; }
    if (s === 2) {
      if (!formData.fullName?.trim()) errs.fullName = "Full name is required";
      if (!formData.email?.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email";
      if (!formData.phone?.trim()) errs.phone = "Phone number is required";
      if (!formData.location?.trim()) errs.location = "Location is required";
      if (!formData.education) errs.education = "Education level is required";
      if (!formData.fieldOfStudy?.trim()) errs.fieldOfStudy = "Field of study is required";
    }
    if (s === 3 && activeRole) {
      activeRole.customQuestions.filter(q => q.required).forEach(q => {
        if (!formData[q.id]?.trim()) errs[q.id] = "This field is required";
      });
    }
    if (s === 4) {
      if (!formData.motivation?.trim()) errs.motivation = "Motivation is required";
      if (!formData.uniqueValue?.trim()) errs.uniqueValue = "This field is required";
      if (!formData.hoursPerWeek?.trim()) errs.hoursPerWeek = "Hours per week is required";
      if (!formData.availableStartDate) errs.availableStartDate = "Start date is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (validateStep(step) && step < STEPS.length - 1) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const goBack = () => { if (step > 0) { setErrors({}); setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };
  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    try {
      // Separate role-specific answers from standard fields
      const standardFields = ["fullName","email","phone","location","education","fieldOfStudy","occupation","motivation","uniqueValue","hoursPerWeek","availableStartDate","portfolioLinks","referenceName","referenceRelationship","referenceContact"];
      const roleSpecificAnswers: Record<string, string> = {};
      Object.entries(formData).forEach(([key, val]) => {
        if (!standardFields.includes(key) && val) roleSpecificAnswers[key] = val;
      });

      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: selectedRole,
          roleTitle: activeRole?.title || selectedRole,
          ...formData,
          roleSpecificAnswers,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submit error:", err);
      setErrors({ _submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReset = () => { setSubmitted(false); setStep(0); setSelectedRole(""); setFormData({}); setErrors({}); };

  return (
    <div className="relative min-h-screen font-sans bg-[#F5F5F5]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-2 md:py-1 flex items-center justify-between bg-white/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
          <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
            <Image src="/logo.svg" alt="8th Mile Project" fill className="object-contain" />
          </div>
        </div>
        <nav className="hidden md:flex items-center bg-white rounded-full px-2 py-2 shadow-sm">
          {["Home", "Projects", "Partners", "Our Faith", "Contact"].map((item) => (
            <a key={item} href={item === "Home" ? "/" : item === "Our Faith" ? "/our-faith" : item === "Partners" ? "/partners" : item === "Projects" ? "/projects" : "#"}
              className="px-4 lg:px-6 py-2 text-sm font-medium transition-all duration-300 rounded-full text-gray-600 hover:text-[#1a3d2e]">{item}</a>
          ))}
          <a href="/volunteer" className="px-4 lg:px-6 py-2 text-sm font-medium transition-all duration-300 rounded-full bg-[#e8f0e8] text-[#1a3d2e]">Volunteer</a>
        </nav>
        <a href="/donate" className="hidden bg-white md:block px-6 lg:px-8 py-2.5 lg:py-3 text-sm font-semibold border-2 border-[#ffffff] text-[#1a3d2e] rounded-full hover:bg-[#1a3d2e] hover:text-white transition-all duration-300 shadow-sm">Donate Now</a>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden py-4 px-4">
            <nav className="flex flex-col gap-2">
              {["Home", "Projects", "Partners", "Our Faith", "Volunteer", "Contact"].map((item) => (
                <a key={item} href={item === "Home" ? "/" : item === "Our Faith" ? "/our-faith" : item === "Partners" ? "/partners" : item === "Projects" ? "/projects" : item === "Volunteer" ? "/volunteer" : "#"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${item === "Volunteer" ? "bg-[#e8f0e8] text-[#1a3d2e]" : "text-gray-600 hover:text-[#1a3d2e] hover:bg-gray-50"}`}>{item}</a>
              ))}
              <a href="/donate" className="mt-2 w-full px-4 py-3 text-sm font-semibold bg-[#1a3d2e] text-white rounded-lg hover:bg-[#143324] transition-all duration-300 text-center block">Donate Now</a>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-[#1a3d2e] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/vl.jpg" alt="Volunteer with us" fill className="object-cover object-center opacity-30 mix-blend-overlay" priority />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
            <span className="text-xs font-bold tracking-wider text-white uppercase">Call for Applications</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">Volunteer With Us</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">Use your skills and passion to contribute to meaningful impact and create lasting change in our communities.</p>
        </div>
      </section>

      {/* WIZARD */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          {submitted ? (
            <div className="bg-white rounded-[2rem] p-8 md:p-16 text-center shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
              <p className="text-lg text-gray-600 mb-8">Thank you for your interest in volunteering with us. Our team will review your application and get back to you shortly.</p>
              <button onClick={handleReset} className="px-8 py-4 bg-[#1a3d2e] text-white rounded-xl font-bold hover:bg-[#143324] transition-all">Submit Another Application</button>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl border border-gray-100">
              {/* Progress Bar */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  {STEPS.map((label, i) => (
                    <div key={label} className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < step ? "bg-[#4ade80] text-white" : i === step ? "bg-[#1a3d2e] text-white ring-4 ring-[#1a3d2e]/20" : "bg-gray-200 text-gray-500"}`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs mt-1.5 font-medium text-center ${i <= step ? "text-[#1a3d2e]" : "text-gray-400"}`}>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-[#1a3d2e] h-1.5 rounded-full transition-all duration-500" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">
                {step === 0 && <StepSelectRole roles={volunteerRoles} selectedId={selectedRole} onSelect={(id) => { setSelectedRole(id); if (errors._role) setErrors(prev => { const n = { ...prev }; delete n._role; return n; }); }} error={errors._role} />}
                {step === 1 && activeRole && <StepRoleDetails role={activeRole} />}
                {step === 2 && <StepPersonalInfo formData={formData} onChange={handleChange} errors={errors} />}
                {step === 3 && activeRole && <StepRoleQuestions role={activeRole} formData={formData} onChange={handleChange} errors={errors} />}
                {step === 4 && <StepFinal formData={formData} onChange={handleChange} errors={errors} isSubmitting={isSubmitting} onSubmit={handleSubmit} />}
              </div>

              {/* Navigation */}
              {step < 4 && (
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                  <button type="button" onClick={goBack} disabled={step === 0}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-xl hover:bg-gray-50">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={goNext}
                    className="flex items-center gap-2 px-8 py-3 text-sm font-bold bg-[#1a3d2e] text-white rounded-xl hover:bg-[#143324] transition-all shadow-md">
                    {step === 1 ? "I'm Interested — Continue" : "Next"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f261c] py-16 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12"><Image src="/logo.svg" alt="8th Mile Project" fill className="object-contain" /></div>
                <span className="text-white font-bold text-lg">8th Mile Project</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">The missions&apos; arm of YWAP, caring for people in need as instructed in Matthew 25:35-40.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[{ label: "Home", href: "/" }, { label: "About Us", href: "#" }, { label: "Our Projects", href: "/projects" }, { label: "Our Faith", href: "/our-faith" }, { label: "Contact", href: "#" }].map(l => (
                  <li key={l.label}><a href={l.href} className="text-white/60 hover:text-white transition-colors text-sm">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Our Programs</h4>
              <ul className="space-y-3">
                {["Medical Outreaches", "Student Support", "Back to School", "Homes for Widows", "Bible Donation"].map(p => (
                  <li key={p}><a href="/projects" className="text-white/60 hover:text-white transition-colors text-sm">{p}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Contact Us</h4>
              <ul className="space-y-3 text-white/60 text-sm">
                <li><a href="mailto:info@the8thmileproject.org" className="hover:text-white transition-colors">info@the8thmileproject.org</a></li>
                <li><a href="tel:+2347039550499" className="hover:text-white transition-colors">+234 703 955 0499</a></li>
                <li>Abuja, Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">The 8th Mile Project © 2026. All rights reserved.</p>
            <div className="flex gap-6">{["Facebook", "Twitter", "Youtube"].map(s => <a key={s} href="#" className="text-white/40 hover:text-white transition-colors text-sm">{s}</a>)}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
