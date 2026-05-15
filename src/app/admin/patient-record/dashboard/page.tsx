"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Users, Calendar, Heart, Activity, Loader2 } from "lucide-react";
import { useProject } from "../../layout";

interface DashboardStats {
  total: number;
  today: number;
  male: number;
  female: number;
  referred: number;
  registration: number;
  nursing: number;
  doctor: number;
  complete: number;
}

interface Entry {
  _id: string;
  fullName: string;
  gender: string;
  date: string;
  stage: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  occupation: string;
  maritalStatus: string;
  referredTo: string;
  diagnosis: string;
  treatment: string;
  attendingDoctor: string;
  createdAt: string;
}

export default function PatientDashboardPage() {
  const { selectedProjectId, selectedProjectName } = useProject();
  const [stats, setStats] = useState<DashboardStats>({ total: 0, today: 0, male: 0, female: 0, referred: 0, registration: 0, nursing: 0, doctor: 0, complete: 0 });
  const [recent, setRecent] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = selectedProjectId ? `?projectId=${selectedProjectId}` : "";
        const res = await fetch(`/api/admin/data-entry${params}`);
        if (res.ok) {
          const data = await res.json();
          const entries: Entry[] = data.entries || [];
          const todayStr = new Date().toISOString().split("T")[0];
          setStats({
            total: entries.length,
            today: entries.filter((e) => e.date === todayStr || e.createdAt?.startsWith(todayStr)).length,
            male: entries.filter((e) => e.gender === "Male").length,
            female: entries.filter((e) => e.gender === "Female").length,
            referred: entries.filter((e) => e.referredTo).length,
            registration: entries.filter((e) => e.stage === "registration").length,
            nursing: entries.filter((e) => e.stage === "nursing").length,
            doctor: entries.filter((e) => e.stage === "doctor").length,
            complete: entries.filter((e) => e.stage === "complete").length,
          });
          setRecent(entries.slice(0, 5));
        }
      } catch {
        console.error("Failed to load stats");
      }
      setLoading(false);
    };
    load();
  }, [selectedProjectId]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d5a3d]" />
      </div>
    );
  }

  const cards = [
    { icon: Users, label: "Total Patients", value: stats.total, color: "bg-blue-50 text-blue-600" },
    { icon: Calendar, label: "Today", value: stats.today, color: "bg-emerald-50 text-emerald-600" },
    { icon: Heart, label: "Male", value: stats.male, color: "bg-indigo-50 text-indigo-600" },
    { icon: Activity, label: "Female", value: stats.female, color: "bg-pink-50 text-pink-600" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#2d5a3d] font-medium mb-1">
          <ClipboardList className="w-4 h-4" />
          <span>Patient Records</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {selectedProjectId ? `Project: ${selectedProjectName}` : "All projects"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Registration", value: stats.registration, color: "bg-blue-50 text-blue-600" },
          { label: "Nursing", value: stats.nursing, color: "bg-amber-50 text-amber-600" },
          { label: "Doctor", value: stats.doctor, color: "bg-purple-50 text-purple-600" },
          { label: "Complete", value: stats.complete, color: "bg-green-50 text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {stats.referred > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
          <Activity className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-800 font-medium">
            {stats.referred} patient{stats.referred > 1 ? "s" : ""} referred for further care
          </p>
        </div>
      )}

      {/* Recent */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Registrations</h2>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No patients registered yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((entry: Entry) => (
              <div key={entry._id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{entry.fullName}</p>
                  <p className="text-sm text-gray-500">{entry.date} · {entry.gender} · {entry.phoneNumber}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(entry.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
