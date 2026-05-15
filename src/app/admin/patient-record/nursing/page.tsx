"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Loader2, CheckCircle, XCircle, Users, Stethoscope, Activity } from "lucide-react";
import { useProject } from "../../layout";

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
  createdAt: string;
  stage: string;
}

interface FormData {
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
}

const emptyForm: FormData = {
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
  nurseHealthWorker: "",
  nurseHealthWorkerDate: "",
};

export default function NursingPage() {
  const { selectedProjectId } = useProject();
  const [queue, setQueue] = useState<Patient[]>([]);
  const [current, setCurrent] = useState<Patient | null>(null);
  const [form, setForm] = useState<FormData>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const flash = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [queueRes, meRes, countsRes] = await Promise.all([
          fetch(`/api/admin/data-entry${selectedProjectId ? `?projectId=${selectedProjectId}&stage=registration` : "?stage=registration"}`),
          fetch("/api/auth/me"),
          fetch("/api/admin/counts"),
        ]);
        if (queueRes.ok) {
          const d = await queueRes.json();
          const entries = d.entries || [];
          setQueue(entries);
          if (entries.length > 0 && !current) {
            setCurrent(entries[0]);
            setForm({ ...emptyForm });
          }
        }
        if (meRes.ok) { const me = await meRes.json(); setCurrentUser(me.user); }
        if (countsRes.ok) { const c = await countsRes.json(); setSessionCount(c.nursingCount || 0); }
      } catch { console.error("Failed to load data"); }
      setLoading(false);
    };
    load();
  }, [selectedProjectId]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    setSubmitting(true);
    try {
      const payload = {
        stage: "nursing",
        ...form,
        nurseHealthWorker: currentUser?.name || form.nurseHealthWorker || "Unknown",
        nurseHealthWorkerDate: form.nurseHealthWorkerDate || new Date().toISOString().split("T")[0],
      };
      const res = await fetch(`/api/admin/data-entry/${current._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        flash("Nursing assessment submitted");
        fetch("/api/admin/counts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "nursing" }) })
          .then((r) => { if (r.ok) r.json().then((c) => setSessionCount(c.nursingCount)); });
        const remaining = queue.filter((p) => p._id !== current._id);
        setQueue(remaining);
        if (remaining.length > 0) {
          setCurrent(remaining[0]);
          setForm({ ...emptyForm });
        } else {
          setCurrent(null);
          setForm({ ...emptyForm });
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Nursing Assessment</h1>
        <p className="text-gray-500 mt-1">Medical history and vitals (Stage 2 of 3)</p>
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
              <span className="text-sm text-gray-500 font-medium">Nurse</span>
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
          <p className="text-sm text-gray-400 mt-1">All patients have been attended to</p>
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

          {/* Nursing Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-500 mb-4">A. Personal Information (Read Only)</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
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

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">B. Medical History</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Do you have any known medical condition?</label>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasMedicalCondition" checked={v === "Yes" ? form.hasMedicalCondition : !form.hasMedicalCondition}
                          onChange={() => update("hasMedicalCondition", v === "Yes")}
                          className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                        <span className="text-sm text-gray-700">{v}</span>
                      </label>
                    ))}
                  </div>
                  {form.hasMedicalCondition && (
                    <input type="text" value={form.medicalConditionDetails} onChange={(e) => update("medicalConditionDetails", e.target.value)}
                      className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                      placeholder="If yes, specify" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Are you currently on any medication?</label>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="onMedication" checked={v === "Yes" ? form.onMedication : !form.onMedication}
                          onChange={() => update("onMedication", v === "Yes")}
                          className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                        <span className="text-sm text-gray-700">{v}</span>
                      </label>
                    ))}
                  </div>
                  {form.onMedication && (
                    <input type="text" value={form.medicationDetails} onChange={(e) => update("medicationDetails", e.target.value)}
                      className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                      placeholder="If yes, list" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Do you have any allergies?</label>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasAllergies" checked={v === "Yes" ? form.hasAllergies : !form.hasAllergies}
                          onChange={() => update("hasAllergies", v === "Yes")}
                          className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                        <span className="text-sm text-gray-700">{v}</span>
                      </label>
                    ))}
                  </div>
                  {form.hasAllergies && (
                    <input type="text" value={form.allergyDetails} onChange={(e) => update("allergyDetails", e.target.value)}
                      className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                      placeholder="If yes, specify" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Past surgeries (if any)</label>
                  <input type="text" value={form.pastSurgeries} onChange={(e) => update("pastSurgeries", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                    placeholder="Past surgeries" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">C. Vitals</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pulse Rate (bpm)</label>
                  <input type="text" value={form.pulseRate} onChange={(e) => update("pulseRate", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent" placeholder="bpm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Respiratory Rate</label>
                  <input type="text" value={form.respiratoryRate} onChange={(e) => update("respiratoryRate", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent" placeholder="/min" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Pressure (mmHg)</label>
                  <input type="text" value={form.bloodPressure} onChange={(e) => update("bloodPressure", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent" placeholder="e.g., 120/80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Sugar Level</label>
                  <input type="text" value={form.bloodSugarLevel} onChange={(e) => update("bloodSugarLevel", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent" placeholder="mmol/L" />
                </div>
              </div>
            </div>

            {/* Nurse Signature - Hidden, auto-populated */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">Nurse / Health Worker</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input type="text" value={currentUser?.name || form.nurseHealthWorker} onChange={(e) => update("nurseHealthWorker", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent bg-gray-50 text-gray-500"
                    placeholder="Nurse's name" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                  <input type="date" value={form.nurseHealthWorkerDate || new Date().toISOString().split("T")[0]} onChange={(e) => update("nurseHealthWorkerDate", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent" />
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
