"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Loader2, CheckCircle, XCircle, UserPlus, Activity } from "lucide-react";
import { useProject } from "../../layout";

interface FormData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  maritalStatus: string;
  nextOfKin: string;
  nextOfKinPhone: string;
}

const emptyForm: FormData = {
  fullName: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  address: "",
  occupation: "",
  maritalStatus: "",
  nextOfKin: "",
  nextOfKinPhone: "",
};

export default function RegistrationPage() {
  const { selectedProjectId, selectedProjectName } = useProject();
  const [form, setForm] = useState<FormData>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const flash = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      const [meRes, countsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/counts"),
      ]);
      if (meRes.ok) { const me = await meRes.json(); setCurrentUser(me.user); }
      if (countsRes.ok) { const c = await countsRes.json(); setSessionCount(c.registrationCount || 0); }
    };
    load();
  }, []);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) { flash("Full name is required", "error"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/data-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, projectId: selectedProjectId || "", projectName: selectedProjectName }),
      });
      if (res.ok) {
        flash("Patient registered successfully");
        fetch("/api/admin/counts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "registration" }) })
          .then((r) => { if (r.ok) r.json().then((c) => setSessionCount(c.registrationCount)); });
        setForm({ ...emptyForm });
      } else {
        const d = await res.json();
        flash(d.error || "Failed to save", "error");
      }
    } catch { flash("Failed to save entry", "error"); }
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Patient Registration</h1>
        <p className="text-gray-500 mt-1">Register a new patient (Stage 1 of 3)</p>
      </div>

      {/* Stats Cards */}
      {currentUser && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#2d5a3d]/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-[#2d5a3d]" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Registered</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{sessionCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">this session</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Staff</span>
            </div>
            <p className="text-lg font-bold text-gray-900 truncate">{currentUser?.name}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-md font-bold text-gray-900 mb-4 text-[#2d5a3d]">A. Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input type="text" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="Full Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <div className="flex gap-6">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" checked={form.gender === g} onChange={() => update("gender", g)}
                      className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                    <span className="text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth / Age</label>
                <input type="text" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="e.g., 15/05/1990 or 34 years" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input type="text" value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="Phone Number" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address (State of Origin and community)</label>
              <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                placeholder="State and community" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation</label>
                <input type="text" value={form.occupation} onChange={(e) => update("occupation", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="Occupation" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marital Status</label>
                <div className="flex gap-6 pt-2">
                  {["Single", "Married", "Other"].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="maritalStatus" checked={form.maritalStatus === s} onChange={() => update("maritalStatus", s)}
                        className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                      <span className="text-sm text-gray-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Next of Kin</label>
                <input type="text" value={form.nextOfKin} onChange={(e) => update("nextOfKin", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="Next of Kin" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Next of Kin Phone</label>
                <input type="text" value={form.nextOfKinPhone} onChange={(e) => update("nextOfKinPhone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent"
                  placeholder="Next of Kin Phone" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pb-8">
          <button type="button" onClick={() => setForm({ ...emptyForm })}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            Reset
          </button>
          <button type="submit" disabled={submitting}
            className="px-8 py-3 bg-[#1a3d2e] text-white rounded-xl hover:bg-[#143324] transition-colors font-semibold disabled:opacity-50 flex items-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Saving..." : "Register Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}
