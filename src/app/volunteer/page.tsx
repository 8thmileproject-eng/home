"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { volunteerRoles } from "./roles";
import { StepSelectRole, StepRoleDetails, StepPersonalInfo, StepRoleQuestions, StepFinal } from "./WizardSteps";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
      <Header />

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
      <Footer />
    </div>
  );
}
