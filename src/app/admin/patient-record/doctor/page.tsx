"use client";

import { useState, useEffect, useCallback } from "react";
import { ClipboardList, Loader2, CheckCircle, XCircle, Users, Mic, PenLine, Activity, Stethoscope } from "lucide-react";
import { useProject } from "../../layout";
import SpeechInput from "@/app/components/inputs/SpeechInput";
import NotepadInput from "@/app/components/inputs/NotepadInput";
import CameraInput from "@/app/components/inputs/CameraInput";

interface Patient {
  _id: string;
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
  nurseHealthWorker: string;
  nurseHealthWorkerDate: string;
  createdAt: string;
  stage: string;
}

interface FormData {
  presentingComplaints: string;
  doctorsAssessment: string;
  diagnosis: string;
  treatment: string;
  referredTo: string;
  reasonForReferral: string;
}

const emptyForm: FormData = {
  presentingComplaints: "",
  doctorsAssessment: "",
  diagnosis: "",
  treatment: "",
  referredTo: "",
  reasonForReferral: "",
};

export default function DoctorPage() {
  const { selectedProjectId } = useProject();
  const [queue, setQueue] = useState<Patient[]>([]);
  const [current, setCurrent] = useState<Patient | null>(null);
  const [form, setForm] = useState<FormData>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [inputModes, setInputModes] = useState<Record<string, "simple" | "notepad">>({});
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [sessionCount, setSessionCount] = useState(0);

  const flash = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [queueRes, meRes, countsRes] = await Promise.all([
          fetch(`/api/admin/data-entry${selectedProjectId ? `?projectId=${selectedProjectId}&stage=nursing` : "?stage=nursing"}`),
          fetch("/api/auth/me"),
          fetch("/api/admin/counts"),
        ]);
        if (queueRes.ok) {
          const d = await queueRes.json();
          const entries = d.entries || [];
          setQueue(entries);
          if (entries.length > 0 && !current) setCurrent(entries[0]);
        }
        if (meRes.ok) { const me = await meRes.json(); setCurrentUser(me.user); }
        if (countsRes.ok) { const c = await countsRes.json(); setSessionCount(c.doctorCount || 0); }
      } catch { console.error("Failed to load data"); }
      setLoading(false);
    };
    load();
  }, [selectedProjectId]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleMode = (section: string) => {
    setInputModes((prev) => ({ ...prev, [section]: prev[section] === "notepad" ? "simple" : "notepad" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    setSubmitting(true);
    try {
      const payload = {
        stage: "complete",
        ...form,
        attendingDoctor: currentUser?.name || "Unknown",
        attendingDoctorDate: new Date().toISOString().split("T")[0],
      };
      const res = await fetch(`/api/admin/data-entry/${current._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        flash("Doctor's assessment submitted");
        fetch("/api/admin/counts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "doctor" }) })
          .then((r) => { if (r.ok) r.json().then((c) => setSessionCount(c.doctorCount)); });
        const remaining = queue.filter((p) => p._id !== current._id);
        setQueue(remaining);
        if (remaining.length > 0) {
          setCurrent(remaining[0]);
          setForm({ ...emptyForm });
          setPhotos({});
          setInputModes({});
        } else {
          setCurrent(null);
          setForm({ ...emptyForm });
          setPhotos({});
          setInputModes({});
        }
      } else { const d = await res.json(); flash(d.error || "Failed to save", "error"); }
    } catch { flash("Failed to save", "error"); }
    setSubmitting(false);
  };

  const skip = () => {
    if (!current || queue.length <= 1) return;
    const remaining = queue.filter((p) => p._id !== current._id);
    setQueue(remaining);
    setCurrent(remaining[0]);
    setForm({ ...emptyForm });
    setPhotos({});
    setInputModes({});
  };

  const handleCapture = useCallback(async (section: string, onChange: (v: string) => void, dataUrl: string) => {
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      if (!res.ok) { flash("Upload failed", "error"); return; }
      const { url } = await res.json();
      setPhotos((prev) => ({ ...prev, [section]: url }));
      const imgTag = `<img src="${url}" alt="Photo" style="max-width:100%;border-radius:8px;margin-top:8px;" />`;
      onChange(imgTag);
    } catch { flash("Upload failed", "error"); }
  }, []);

  const handleRetake = useCallback((section: string, onChange: (v: string) => void) => {
    setPhotos((prev) => {
      const next = { ...prev };
      delete next[section];
      return next;
    });
    onChange("");
  }, []);

  const renderRichField = (section: string, value: string, onChange: (v: string) => void, placeholder: string) => {
    const photoUrl = photos[section];
    const mode = inputModes[section] || "simple";
    return (
      <div>
        {photoUrl ? (
          <div className="space-y-3">
            <img src={photoUrl} alt="Captured photo" className="w-full rounded-xl border border-gray-200" />
            <button type="button" onClick={() => handleRetake(section, onChange)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              Retake Photo
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-end mb-2 gap-1.5">
              <CameraInput onCapture={(dataUrl) => handleCapture(section, onChange, dataUrl)} />
              <button type="button" onClick={() => toggleMode(section)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                  mode === "notepad" ? "bg-[#2d5a3d] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {mode === "notepad" ? <Mic className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
                {mode === "notepad" ? "Simple" : "Notepad"}
              </button>
            </div>
            {mode === "notepad" ? (
              <NotepadInput value={value} onChange={onChange} placeholder={placeholder} />
            ) : (
              <SpeechInput value={value} onChange={onChange} placeholder={placeholder} />
            )}
          </>
        )}
      </div>
    );
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Doctor&apos;s Assessment</h1>
        <p className="text-gray-500 mt-1">Diagnosis, treatment and prescription (Stage 3 of 3)</p>
      </div>

      {/* Stats Cards */}
      {currentUser && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#2d5a3d]/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#2d5a3d]" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Attended</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{sessionCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">this session</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Waiting</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{queue.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">in queue</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Doctor</span>
            </div>
            <p className="text-lg font-bold text-gray-900 truncate">{currentUser?.name}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#2d5a3d]" /></div>
      ) : !current ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-500">No Patients Waiting</h2>
          <p className="text-sm text-gray-400 mt-1">All patients have been assessed</p>
        </div>
      ) : (
        <>
          {/* Current Patient Banner */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2d5a3d]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#2d5a3d]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{current.fullName}</p>
                <p className="text-xs text-gray-500">{current.gender} &middot; {current.phoneNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                {queue.length > 1 ? <>{queue.length - 1} waiting to be next</> : "Last in queue"}
              </p>
              <p className="text-xs text-gray-400">{new Date(current.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Doctor Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sections A-C - Read Only */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-500 mb-4">Patient History (Read Only)</h3>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">A. Personal Information</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                  <div className="col-span-2"><span className="text-gray-500">Full Name:</span> <span className="text-gray-900">{current.fullName}</span></div>
                  <div><span className="text-gray-500">Gender:</span> <span className="text-gray-900">{current.gender || "-"}</span></div>
                  <div><span className="text-gray-500">DOB/Age:</span> <span className="text-gray-900">{current.dateOfBirth || "-"}</span></div>
                  <div><span className="text-gray-500">Phone:</span> <span className="text-gray-900">{current.phoneNumber || "-"}</span></div>
                  <div><span className="text-gray-500">Address:</span> <span className="text-gray-900">{current.address || "-"}</span></div>
                  <div><span className="text-gray-500">Occupation:</span> <span className="text-gray-900">{current.occupation || "-"}</span></div>
                  <div><span className="text-gray-500">Marital Status:</span> <span className="text-gray-900">{current.maritalStatus || "-"}</span></div>
                  <div><span className="text-gray-500">Next of Kin:</span> <span className="text-gray-900">{current.nextOfKin || "-"}</span></div>
                  <div><span className="text-gray-500">Kin Phone:</span> <span className="text-gray-900">{current.nextOfKinPhone || "-"}</span></div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">B. Medical History</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                  <div><span className="text-gray-500">Medical Condition:</span> <span className="text-gray-900">{current.hasMedicalCondition ? `Yes - ${current.medicalConditionDetails}` : "No"}</span></div>
                  <div><span className="text-gray-500">On Medication:</span> <span className="text-gray-900">{current.onMedication ? `Yes - ${current.medicationDetails}` : "No"}</span></div>
                  <div><span className="text-gray-500">Allergies:</span> <span className="text-gray-900">{current.hasAllergies ? `Yes - ${current.allergyDetails}` : "No"}</span></div>
                  <div><span className="text-gray-500">Past Surgeries:</span> <span className="text-gray-900">{current.pastSurgeries || "None"}</span></div>
                </div>
              </div>

              {(current.pulseRate || current.respiratoryRate || current.bloodPressure || current.bloodSugarLevel) && (
                <div>
                  <h4 className="font-semibold text-gray-700 text-sm mb-2">C. Vitals (by {current.nurseHealthWorker || "Nurse"})</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                    {current.pulseRate && <div><span className="text-gray-500">Pulse Rate:</span> <span className="text-gray-900">{current.pulseRate} bpm</span></div>}
                    {current.respiratoryRate && <div><span className="text-gray-500">Respiratory Rate:</span> <span className="text-gray-900">{current.respiratoryRate} /min</span></div>}
                    {current.bloodPressure && <div><span className="text-gray-500">Blood Pressure:</span> <span className="text-gray-900">{current.bloodPressure} mmHg</span></div>}
                    {current.bloodSugarLevel && <div><span className="text-gray-500">Blood Sugar:</span> <span className="text-gray-900">{current.bloodSugarLevel} mmol/L</span></div>}
                  </div>
                </div>
              )}
            </div>

            {/* D. Presenting Complaints */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">D. Presenting Complaints</h3>
              {renderRichField("presentingComplaints", form.presentingComplaints, (v) => update("presentingComplaints", v), "Describe the patient's presenting complaints...")}
            </div>

            {/* E. Doctor's Assessment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">E. Doctor&apos;s Assessment &amp; Comments</h3>
              {renderRichField("doctorsAssessment", form.doctorsAssessment, (v) => update("doctorsAssessment", v), "Doctor's assessment and comments...")}
            </div>

            {/* F. Diagnosis */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">F. Diagnosis</h3>
              {renderRichField("diagnosis", form.diagnosis, (v) => update("diagnosis", v), "Diagnosis...")}
            </div>

            {/* G. Treatment / Prescription */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">G. Treatment / Prescription</h3>
              {renderRichField("treatment", form.treatment, (v) => update("treatment", v), "Treatment and prescription details...")}
            </div>

            {/* H. Referral */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">H. Referral <span className="text-xs font-normal text-gray-400">(if required)</span></h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Referred to</label>
                  <input type="text" value={form.referredTo} onChange={(e) => update("referredTo", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                    placeholder="Facility / department" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Referral</label>
                  <input type="text" value={form.reasonForReferral} onChange={(e) => update("reasonForReferral", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                    placeholder="Reason for referral" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pb-8">
              {queue.length > 1 && (
                <button type="button" onClick={skip}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Skip &middot; Next Patient
                </button>
              )}
              <button type="submit" disabled={submitting}
                className="px-8 py-3 bg-[#1a3d2e] text-white rounded-xl hover:bg-[#143324] transition-colors font-semibold disabled:opacity-50 flex items-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Saving..." : "Submit &amp; Next"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
