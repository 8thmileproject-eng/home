"use client";
import { Check, Clock, Briefcase, Award, Upload, ArrowRight } from "lucide-react";
import { VolunteerRole, CustomQuestion } from "./roles";

const baseCls = "w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-colors";
const inputCls = (hasError: boolean) => `${baseCls} ${hasError ? "border-red-400 focus:ring-red-400 bg-red-50/30" : "border-gray-200 focus:ring-[#2d5a3d]"}`;
const errText = "text-red-500 text-xs mt-1";

function FieldWrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {children}
      {error && <p className={errText}>{error}</p>}
    </div>
  );
}

function DynamicField({ q, value, onChange, error }: { q: CustomQuestion; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; error?: string }) {
  const cls = inputCls(!!error);
  return (
    <FieldWrapper label={q.label} error={error}>
      {q.type === "text" && <input type="text" name={q.id} value={value} onChange={onChange} className={cls} placeholder={q.placeholder} />}
      {q.type === "textarea" && <textarea name={q.id} value={value} onChange={onChange} rows={3} className={cls} placeholder={q.placeholder} />}
      {q.type === "select" && (
        <select name={q.id} value={value} onChange={onChange} className={cls}>
          <option value="">Select...</option>
          {q.options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {q.type === "radio" && (
        <div className="flex flex-wrap gap-6 mt-1">
          {q.options?.map(o => (
            <label key={o} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name={q.id} value={o} checked={value === o} onChange={onChange} className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
              <span className="text-sm">{o}</span>
            </label>
          ))}
        </div>
      )}
    </FieldWrapper>
  );
}

const roleIcons: Record<string, string> = {
  "medical-unit": "🩺",
  "relief-and-welfare": "🍚",
  "education-and-school": "📚",
  "volunteers-management": "📋",
  "prayerroom": "🙏",
  "partnership-and-resource": "🤝",
  "monitoring-and-evaluation": "📊",
  "media-and-communications": "📢",
  "operations-and-logistics": "📦",
  "finance-unit": "💰",
  "admin-unit": "🏢",
  "safeguarding-and-ethics": "🛡️",
};

// Step 0
export function StepSelectRole({ roles, selectedId, onSelect, error }: { roles: VolunteerRole[]; selectedId: string; onSelect: (id: string) => void; error?: string }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose a Volunteer Role</h2>
      <p className="text-gray-500 mb-6">Select the role that best matches your skills and interests.</p>
      {error && <p className="text-red-500 text-sm font-medium mb-4 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map(r => (
          <button key={r.id} type="button" onClick={() => onSelect(r.id)}
            className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${selectedId === r.id ? "border-[#1a3d2e] bg-[#e8f0e8] shadow-md" : "border-gray-200 bg-white hover:border-[#1a3d2e]/40"}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{roleIcons[r.id] || "👤"}</span>
              <div>
                <p className="font-bold text-gray-900">{r.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.about.slice(0, 100)}...</p>
              </div>
            </div>
            {selectedId === r.id && <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#1a3d2e]"><Check className="w-4 h-4" /> Selected</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 1
export function StepRoleDetails({ role }: { role: VolunteerRole }) {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1a3d2e] bg-[#e8f0e8] px-3 py-1 rounded-full mb-4">{roleIcons[role.id]} {role.title}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">About This Role</h2>
        <p className="text-gray-600 leading-relaxed">{role.about}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-2xl p-4"><Clock className="w-5 h-5 text-[#2d5a3d] mb-2" /><p className="font-semibold text-gray-900 text-sm">Commitment</p><p className="text-gray-500 text-xs mt-1">{role.commitment.find(c => c.toLowerCase().includes("hour") || c.toLowerCase().includes("flex")) || role.commitment[1]}</p></div>
        <div className="bg-gray-50 rounded-2xl p-4"><Briefcase className="w-5 h-5 text-[#2d5a3d] mb-2" /><p className="font-semibold text-gray-900 text-sm">Location</p><p className="text-gray-500 text-xs mt-1">{role.commitment[0]}</p></div>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />Key Responsibilities</h3>
        <ul className="space-y-2">{role.responsibilities.map((r, i) => <li key={i} className="text-gray-600 text-sm flex items-start gap-2"><Check className="w-4 h-4 text-[#4ade80] mt-0.5 shrink-0" /><span>{r}</span></li>)}</ul>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />Requirements</h3>
        <ul className="space-y-2">{role.requirements.map((r, i) => <li key={i} className="text-gray-600 text-sm flex items-start gap-2"><Check className="w-4 h-4 text-[#4ade80] mt-0.5 shrink-0" /><span>{r}</span></li>)}</ul>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-[#2d5a3d]" />What You Gain</h3>
        <ul className="space-y-2">{role.gains.map((g, i) => <li key={i} className="text-gray-600 text-sm flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" /><span>{g}</span></li>)}</ul>
      </div>
    </div>
  );
}

// Step 2
export function StepPersonalInfo({ formData, onChange, errors }: { formData: Record<string, string>; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; errors: Record<string, string> }) {
  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Personal Information</h2><p className="text-gray-500">Tell us about yourself.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldWrapper label="Full Name *" error={errors.fullName}><input type="text" name="fullName" value={formData.fullName || ""} onChange={onChange} className={inputCls(!!errors.fullName)} placeholder="Jane Doe" /></FieldWrapper>
        <FieldWrapper label="Email Address *" error={errors.email}><input type="email" name="email" value={formData.email || ""} onChange={onChange} className={inputCls(!!errors.email)} placeholder="jane@example.com" /></FieldWrapper>
        <FieldWrapper label="Phone Number *" error={errors.phone}><input type="tel" name="phone" value={formData.phone || ""} onChange={onChange} className={inputCls(!!errors.phone)} placeholder="+234..." /></FieldWrapper>
        <FieldWrapper label="Location (City/Country) *" error={errors.location}><input type="text" name="location" value={formData.location || ""} onChange={onChange} className={inputCls(!!errors.location)} placeholder="Kaduna, Nigeria" /></FieldWrapper>
      </div>
      <div className="space-y-5">
        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Background</h3>
        <FieldWrapper label="Highest Level of Education *" error={errors.education}>
          <select name="education" value={formData.education || ""} onChange={onChange} className={inputCls(!!errors.education)}>
            <option value="">Select option...</option>
            <option value="High School">High School</option>
            <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
            <option value="Master's Degree">Master&apos;s Degree</option>
            <option value="Medical Degree (MD/DO/MBBS)">Medical Degree (MD/DO/MBBS)</option>
            <option value="PhD">PhD</option>
            <option value="Other">Other</option>
          </select>
        </FieldWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldWrapper label="Field of Study *" error={errors.fieldOfStudy}><input type="text" name="fieldOfStudy" value={formData.fieldOfStudy || ""} onChange={onChange} className={inputCls(!!errors.fieldOfStudy)} placeholder="e.g. Mass Communication, Nursing" /></FieldWrapper>
          <FieldWrapper label="Current Occupation"><input type="text" name="occupation" value={formData.occupation || ""} onChange={onChange} className={inputCls(false)} placeholder="e.g. Student, Registered Nurse" /></FieldWrapper>
        </div>
      </div>
    </div>
  );
}

// Step 3
export function StepRoleQuestions({ role, formData, onChange, errors }: { role: VolunteerRole; formData: Record<string, string>; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; errors: Record<string, string> }) {
  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Role-Specific Questions</h2><p className="text-gray-500">These questions are specific to the <span className="font-bold text-[#1a3d2e]">{role.title}</span> position.</p></div>
      <div className="space-y-6">
        {role.customQuestions.map(q => (
          <DynamicField key={q.id} q={q} value={formData[q.id] || ""} onChange={onChange} error={errors[q.id]} />
        ))}
      </div>
    </div>
  );
}

// Step 4
export function StepFinal({ formData, onChange, errors, isSubmitting, onSubmit }: { formData: Record<string, string>; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; errors: Record<string, string>; isSubmitting: boolean; onSubmit: () => void }) {
  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Almost There!</h2><p className="text-gray-500">Tell us your motivation and availability.</p></div>
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Motivation</h3>
        <FieldWrapper label="Why are you interested in this volunteer role? *" error={errors.motivation}><textarea name="motivation" value={formData.motivation || ""} onChange={onChange} rows={3} className={inputCls(!!errors.motivation)} placeholder="Your motivation..." /></FieldWrapper>
        <FieldWrapper label="What unique value or skills would you bring? *" error={errors.uniqueValue}><textarea name="uniqueValue" value={formData.uniqueValue || ""} onChange={onChange} rows={3} className={inputCls(!!errors.uniqueValue)} placeholder="Your unique value..." /></FieldWrapper>
      </div>
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Availability</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldWrapper label="Hours per week available *" error={errors.hoursPerWeek}><input type="text" name="hoursPerWeek" value={formData.hoursPerWeek || ""} onChange={onChange} className={inputCls(!!errors.hoursPerWeek)} placeholder="e.g. 10 hours" /></FieldWrapper>
          <FieldWrapper label="Available Start Date *" error={errors.availableStartDate}><input type="date" name="availableStartDate" value={formData.availableStartDate || ""} onChange={onChange} className={inputCls(!!errors.availableStartDate)} /></FieldWrapper>
        </div>
      </div>
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Supporting Documents</h3>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Upload CV <span className="font-normal text-gray-400">(optional)</span></label>
          <label htmlFor="cv-upload" className="block w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-600">Click to upload or drag and drop</p><p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 5MB</p>
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" id="cv-upload" />
          </label>
        </div>
        <FieldWrapper label="Portfolio / Samples link (optional)"><input type="url" name="portfolioLinks" value={formData.portfolioLinks || ""} onChange={onChange} className={inputCls(false)} placeholder="https://..." /></FieldWrapper>
      </div>
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">References <span className="text-gray-400 font-normal text-sm">(Optional)</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FieldWrapper label="Name"><input type="text" name="referenceName" value={formData.referenceName || ""} onChange={onChange} className={inputCls(false)} placeholder="Reference Name" /></FieldWrapper>
          <FieldWrapper label="Relationship"><input type="text" name="referenceRelationship" value={formData.referenceRelationship || ""} onChange={onChange} className={inputCls(false)} placeholder="e.g. Manager" /></FieldWrapper>
          <FieldWrapper label="Contact"><input type="text" name="referenceContact" value={formData.referenceContact || ""} onChange={onChange} className={inputCls(false)} placeholder="Email or Phone" /></FieldWrapper>
        </div>
      </div>
      <button type="button" onClick={onSubmit} disabled={isSubmitting}
        className="w-full py-4 bg-[#1a3d2e] text-white rounded-xl font-bold text-lg hover:bg-[#143324] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg">
        {isSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : <>Submit Application <ArrowRight className="w-5 h-5" /></>}
      </button>
    </div>
  );
}
