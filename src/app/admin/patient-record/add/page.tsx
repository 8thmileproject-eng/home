"use client";

import { useState } from "react";
import { ClipboardList, Loader2, CheckCircle, XCircle, PenLine, Mic } from "lucide-react";
import { useProject } from "../../layout";
import SpeechInput from "./SpeechInput";
import NotepadInput from "./NotepadInput";

interface FormData {
  projectId: string;
  projectName: string;
  date: string;

  fullName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  maritalStatus: string;
  nextOfKin: string;
  nextOfKinPhone: string;

  hasMedicalCondition: boolean;
  medicalConditionDetails: string;
  onMedication: boolean;
  medicationDetails: string;
  hasAllergies: boolean;
  allergyDetails: string;
  pastSurgeries: string;

  pulseRate: string;
  respiratoryRate: string;
  bloodPressure: string;
  bloodSugarLevel: string;

  presentingComplaints: string;
  doctorsAssessment: string;
  diagnosis: string;
  treatment: string;

  referredTo: string;
  reasonForReferral: string;

  attendingDoctor: string;
  attendingDoctorDate: string;
  nurseHealthWorker: string;
  nurseHealthWorkerDate: string;
}

const emptyForm: FormData = {
  projectId: "",
  projectName: "",
  date: new Date().toISOString().split("T")[0],

  fullName: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  address: "",
  occupation: "",
  maritalStatus: "",
  nextOfKin: "",
  nextOfKinPhone: "",

  hasMedicalCondition: false,
  medicalConditionDetails: "",
  onMedication: false,
  medicationDetails: "",
  hasAllergies: false,
  allergyDetails: "",
  pastSurgeries: "",

  pulseRate: "",
  respiratoryRate: "",
  bloodPressure: "",
  bloodSugarLevel: "",

  presentingComplaints: "",
  doctorsAssessment: "",
  diagnosis: "",
  treatment: "",

  referredTo: "",
  reasonForReferral: "",

  attendingDoctor: "",
  attendingDoctorDate: "",
  nurseHealthWorker: "",
  nurseHealthWorkerDate: "",
};

export default function AddPatientRecordPage() {
  const { selectedProjectId, selectedProjectName } = useProject();
  const [form, setForm] = useState<FormData>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [inputModes, setInputModes] = useState<Record<string, "simple" | "notepad">>({});

  const toggleMode = (section: string) => {
    setInputModes((prev) => ({
      ...prev,
      [section]: prev[section] === "notepad" ? "simple" : "notepad",
    }));
  };

  const flash = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      flash("Full name is required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, projectId: selectedProjectId || "", projectName: selectedProjectName };
      const res = await fetch("/api/admin/data-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        flash("Patient registered successfully");
        setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] });
      } else {
        const d = await res.json();
        flash(d.error || "Failed to save", "error");
      }
    } catch {
      flash("Failed to save entry", "error");
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {msg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#2d5a3d] font-medium mb-1">
          <ClipboardList className="w-4 h-4" />
          <span>Patient Records</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add Patient Record</h1>
        <p className="text-gray-500 mt-1">Register a new patient and record their medical encounter</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* A. Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">A. Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <div className="flex gap-6">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={form.gender === g}
                      onChange={() => update("gender", g)}
                      className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]"
                    />
                    <span className="text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth / Age</label>
                <input
                  type="text"
                  value={form.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="e.g., 15/05/1990 or 34 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) => update("phoneNumber", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="Phone Number"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address (State of Origin and community)</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="State and community"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation</label>
                <input
                  type="text"
                  value={form.occupation}
                  onChange={(e) => update("occupation", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="Occupation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marital Status</label>
                <div className="flex gap-6 pt-2">
                  {["Single", "Married", "Other"].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="maritalStatus"
                        checked={form.maritalStatus === s}
                        onChange={() => update("maritalStatus", s)}
                        className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]"
                      />
                      <span className="text-sm text-gray-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Next of Kin</label>
                <input
                  type="text"
                  value={form.nextOfKin}
                  onChange={(e) => update("nextOfKin", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="Next of Kin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Next of Kin Phone</label>
                <input
                  type="text"
                  value={form.nextOfKinPhone}
                  onChange={(e) => update("nextOfKinPhone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="Next of Kin Phone"
                />
              </div>
            </div>
          </div>
        </div>

        {/* B. Medical History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">B. Medical History</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Do you have any known medical condition?</label>
              <div className="flex gap-6">
                {["Yes", "No"].map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasMedicalCondition"
                      checked={v === "Yes" ? form.hasMedicalCondition : !form.hasMedicalCondition}
                      onChange={() => update("hasMedicalCondition", v === "Yes")}
                      className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]"
                    />
                    <span className="text-sm text-gray-700">{v}</span>
                  </label>
                ))}
              </div>
              {form.hasMedicalCondition && (
                <input
                  type="text"
                  value={form.medicalConditionDetails}
                  onChange={(e) => update("medicalConditionDetails", e.target.value)}
                  className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="If yes, specify"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Are you currently on any medication?</label>
              <div className="flex gap-6">
                {["Yes", "No"].map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="onMedication"
                      checked={v === "Yes" ? form.onMedication : !form.onMedication}
                      onChange={() => update("onMedication", v === "Yes")}
                      className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]"
                    />
                    <span className="text-sm text-gray-700">{v}</span>
                  </label>
                ))}
              </div>
              {form.onMedication && (
                <input
                  type="text"
                  value={form.medicationDetails}
                  onChange={(e) => update("medicationDetails", e.target.value)}
                  className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="If yes, list"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Do you have any allergies?</label>
              <div className="flex gap-6">
                {["Yes", "No"].map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasAllergies"
                      checked={v === "Yes" ? form.hasAllergies : !form.hasAllergies}
                      onChange={() => update("hasAllergies", v === "Yes")}
                      className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]"
                    />
                    <span className="text-sm text-gray-700">{v}</span>
                  </label>
                ))}
              </div>
              {form.hasAllergies && (
                <input
                  type="text"
                  value={form.allergyDetails}
                  onChange={(e) => update("allergyDetails", e.target.value)}
                  className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="If yes, specify"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Past surgeries (if any)</label>
              <input
                type="text"
                value={form.pastSurgeries}
                onChange={(e) => update("pastSurgeries", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="Past surgeries"
              />
            </div>
          </div>
        </div>

        {/* C. Vitals */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">C. Vitals <span className="text-xs font-normal text-gray-400">(To be filled by Health Personnel)</span></h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pulse Rate (bpm)</label>
              <input
                type="text"
                value={form.pulseRate}
                onChange={(e) => update("pulseRate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="bpm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Respiratory Rate</label>
              <input
                type="text"
                value={form.respiratoryRate}
                onChange={(e) => update("respiratoryRate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="/min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Pressure (mmHg)</label>
              <input
                type="text"
                value={form.bloodPressure}
                onChange={(e) => update("bloodPressure", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="e.g., 120/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Sugar Level</label>
              <input
                type="text"
                value={form.bloodSugarLevel}
                onChange={(e) => update("bloodSugarLevel", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="mmol/L"
              />
            </div>
          </div>
        </div>

        {/* D. Presenting Complaints */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-gray-900 text-[#2d5a3d]">D. Presenting Complaints</h3>
            <button
              type="button"
              onClick={() => toggleMode("presentingComplaints")}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                inputModes.presentingComplaints === "notepad"
                  ? "bg-[#2d5a3d] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {inputModes.presentingComplaints === "notepad" ? <Mic className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
              {inputModes.presentingComplaints === "notepad" ? "Simple" : "Notepad"}
            </button>
          </div>
          {inputModes.presentingComplaints === "notepad" ? (
            <NotepadInput
              value={form.presentingComplaints}
              onChange={(v) => update("presentingComplaints", v)}
              placeholder="Describe the patient's presenting complaints..."
            />
          ) : (
            <SpeechInput
              value={form.presentingComplaints}
              onChange={(v) => update("presentingComplaints", v)}
              placeholder="Describe the patient's presenting complaints..."
            />
          )}
        </div>

        {/* E. Doctor's Assessment */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-gray-900 text-[#2d5a3d]">E. Doctor&apos;s Assessment &amp; Comments</h3>
            <button
              type="button"
              onClick={() => toggleMode("doctorsAssessment")}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                inputModes.doctorsAssessment === "notepad"
                  ? "bg-[#2d5a3d] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {inputModes.doctorsAssessment === "notepad" ? <Mic className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
              {inputModes.doctorsAssessment === "notepad" ? "Simple" : "Notepad"}
            </button>
          </div>
          {inputModes.doctorsAssessment === "notepad" ? (
            <NotepadInput
              value={form.doctorsAssessment}
              onChange={(v) => update("doctorsAssessment", v)}
              placeholder="Doctor's assessment and comments..."
            />
          ) : (
            <SpeechInput
              value={form.doctorsAssessment}
              onChange={(v) => update("doctorsAssessment", v)}
              placeholder="Doctor's assessment and comments..."
            />
          )}
        </div>

        {/* F. Diagnosis */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-gray-900 text-[#2d5a3d]">F. Diagnosis</h3>
            <button
              type="button"
              onClick={() => toggleMode("diagnosis")}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                inputModes.diagnosis === "notepad"
                  ? "bg-[#2d5a3d] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {inputModes.diagnosis === "notepad" ? <Mic className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
              {inputModes.diagnosis === "notepad" ? "Simple" : "Notepad"}
            </button>
          </div>
          {inputModes.diagnosis === "notepad" ? (
            <NotepadInput
              value={form.diagnosis}
              onChange={(v) => update("diagnosis", v)}
              placeholder="Diagnosis..."
            />
          ) : (
            <SpeechInput
              value={form.diagnosis}
              onChange={(v) => update("diagnosis", v)}
              placeholder="Diagnosis..."
              rows={3}
            />
          )}
        </div>

        {/* G. Treatment / Prescription */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-gray-900 text-[#2d5a3d]">G. Treatment / Prescription</h3>
            <button
              type="button"
              onClick={() => toggleMode("treatment")}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                inputModes.treatment === "notepad"
                  ? "bg-[#2d5a3d] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {inputModes.treatment === "notepad" ? <Mic className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
              {inputModes.treatment === "notepad" ? "Simple" : "Notepad"}
            </button>
          </div>
          {inputModes.treatment === "notepad" ? (
            <NotepadInput
              value={form.treatment}
              onChange={(v) => update("treatment", v)}
              placeholder="Treatment and prescription details..."
            />
          ) : (
            <SpeechInput
              value={form.treatment}
              onChange={(v) => update("treatment", v)}
              placeholder="Treatment and prescription details..."
            />
          )}
        </div>

        {/* H. Referral */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-gray-900 text-[#2d5a3d]">H. Referral <span className="text-xs font-normal text-gray-400">(if required)</span></h3>
            <button
              type="button"
              onClick={() => toggleMode("referral")}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                inputModes.referral === "notepad"
                  ? "bg-[#2d5a3d] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {inputModes.referral === "notepad" ? <Mic className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
              {inputModes.referral === "notepad" ? "Simple" : "Notepad"}
            </button>
          </div>
          {inputModes.referral === "notepad" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Referred to</label>
                <NotepadInput
                  value={form.referredTo}
                  onChange={(v) => update("referredTo", v)}
                  placeholder="Facility / department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Referral</label>
                <NotepadInput
                  value={form.reasonForReferral}
                  onChange={(v) => update("reasonForReferral", v)}
                  placeholder="Reason for referral"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Referred to</label>
                <SpeechInput
                  value={form.referredTo}
                  onChange={(v) => update("referredTo", v)}
                  placeholder="Facility / department"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Referral</label>
                <SpeechInput
                  value={form.reasonForReferral}
                  onChange={(v) => update("reasonForReferral", v)}
                  placeholder="Reason for referral"
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* I. Signatures */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">I. Signatures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Attending Doctor</label>
              <input
                type="text"
                value={form.attendingDoctor}
                onChange={(e) => update("attendingDoctor", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="Doctor's name"
              />
              <input
                type="date"
                value={form.attendingDoctorDate}
                onChange={(e) => update("attendingDoctorDate", e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nurse / Health Worker</label>
              <input
                type="text"
                value={form.nurseHealthWorker}
                onChange={(e) => update("nurseHealthWorker", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="Nurse's name"
              />
              <input
                type="date"
                value={form.nurseHealthWorkerDate}
                onChange={(e) => update("nurseHealthWorkerDate", e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pb-8">
          <button
            type="button"
            onClick={() => setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] })}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-[#1a3d2e] text-white rounded-xl hover:bg-[#143324] transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Saving..." : "Save Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}
