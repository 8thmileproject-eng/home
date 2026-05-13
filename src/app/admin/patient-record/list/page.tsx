"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Loader2, Search, X, Eye, Download, FileText } from "lucide-react";
import { useProject } from "../../layout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Entry {
  _id: string;
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

  createdAt: string;
  updatedAt?: string;
}

export default function ViewPatientRecordsPage() {
  const { selectedProjectId, selectedProjectName } = useProject();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Entry | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = selectedProjectId ? `?projectId=${selectedProjectId}` : "";
        const res = await fetch(`/api/admin/data-entry${params}`);
        if (res.ok) {
          const data = await res.json();
          setEntries(data.entries || []);
        }
      } catch {
        console.error("Failed to load records");
      }
      setLoading(false);
    };
    load();
  }, [selectedProjectId]);

  const filtered = entries.filter((e) =>
    !search || e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.phoneNumber.includes(search) || e.address?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["S/N", "Full Name", "Gender", "DOB/Age", "Phone", "Address", "Occupation", "Marital Status",
      "Next of Kin", "Kin Phone", "Medical Condition", "Medication", "Allergies", "Past Surgeries",
      "Pulse Rate", "Respiratory Rate", "Blood Pressure", "Blood Sugar",
      "Presenting Complaints", "Doctor's Assessment", "Diagnosis", "Treatment",
      "Referred To", "Reason for Referral", "Attending Doctor", "Doctor Date",
      "Nurse/Health Worker", "Nurse Date", "Date", "Project"];
    const rows = filtered.map((e, i) => [
      i + 1, e.fullName, e.gender, e.dateOfBirth, e.phoneNumber, e.address, e.occupation, e.maritalStatus,
      e.nextOfKin, e.nextOfKinPhone,
      e.hasMedicalCondition ? `Yes - ${e.medicalConditionDetails}` : "No",
      e.onMedication ? `Yes - ${e.medicationDetails}` : "No",
      e.hasAllergies ? `Yes - ${e.allergyDetails}` : "No",
      e.pastSurgeries || "None",
      e.pulseRate, e.respiratoryRate, e.bloodPressure, e.bloodSugarLevel,
      e.presentingComplaints, e.doctorsAssessment, e.diagnosis, e.treatment,
      e.referredTo, e.reasonForReferral, e.attendingDoctor, e.attendingDoctorDate,
      e.nurseHealthWorker, e.nurseHealthWorkerDate, e.date, e.projectName,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient_records_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Patient Records", 14, 15);
    doc.setFontSize(9);
    doc.text(`Exported: ${new Date().toLocaleDateString()} | Total: ${filtered.length} records`, 14, 22);
    autoTable(doc, {
      startY: 27,
      head: [["S/N", "Full Name", "Gender", "Phone", "Date", "Diagnosis", "Treatment", "Referred To", "Doctor"]],
      body: filtered.map((e, i) => [i + 1, e.fullName, e.gender, e.phoneNumber, e.date, e.diagnosis, e.treatment, e.referredTo, e.attendingDoctor]),
      styles: { fontSize: 7 },
      headStyles: { fillColor: [45, 90, 61] },
    });
    doc.save(`patient_records_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-[#2d5a3d] font-medium mb-1">
            <ClipboardList className="w-4 h-4" />
            <span>Patient Records</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">View Records</h1>
          <p className="text-gray-500 mt-1">
            {selectedProjectId ? `Project: ${selectedProjectName}` : "All projects"} &middot; {entries.length} record{entries.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or address..."
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent text-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Export Buttons */}
        {!loading && filtered.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3d2e] text-white rounded-xl hover:bg-[#143324] transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#2d5a3d]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">{search ? "No matches found" : "No records yet"}</h3>
            <p className="text-gray-500">{search ? "Try a different search term" : "Register a patient to see their record here"}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">S/N</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Diagnosis</th>
                    <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referred</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((entry, idx) => (
                    <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-400">{idx + 1}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">{entry.fullName}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{entry.gender || "-"}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{entry.phoneNumber || "-"}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{entry.date || "-"}</td>
                      <td className="px-5 py-4 text-sm text-gray-700 max-w-[160px] truncate">{entry.diagnosis || "-"}</td>
                      <td className="px-5 py-4 text-center">
                        {entry.referredTo ? (
                          <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">Yes</span>
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelected(entry)}
                          className="p-2 text-gray-400 hover:text-[#2d5a3d] hover:bg-[#e8f0e8] rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Right Side Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="min-w-0">
                <h2 className="font-bold text-lg text-gray-900 truncate">{selected.fullName}</h2>
                <p className="text-sm text-gray-500">{selected.gender} &middot; {selected.date}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4 shrink-0">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-sm">
              {/* A. Personal Information */}
              <div>
                <h4 className="font-bold text-[#2d5a3d] mb-2">A. Personal Information</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  <div className="col-span-2"><span className="text-gray-500">Full Name:</span> <span className="text-gray-900">{selected.fullName}</span></div>
                  <div><span className="text-gray-500">Gender:</span> <span className="text-gray-900">{selected.gender || "-"}</span></div>
                  <div><span className="text-gray-500">DOB/Age:</span> <span className="text-gray-900">{selected.dateOfBirth || "-"}</span></div>
                  <div><span className="text-gray-500">Phone:</span> <span className="text-gray-900">{selected.phoneNumber || "-"}</span></div>
                  <div><span className="text-gray-500">Address:</span> <span className="text-gray-900">{selected.address || "-"}</span></div>
                  <div><span className="text-gray-500">Occupation:</span> <span className="text-gray-900">{selected.occupation || "-"}</span></div>
                  <div><span className="text-gray-500">Marital Status:</span> <span className="text-gray-900">{selected.maritalStatus || "-"}</span></div>
                  <div><span className="text-gray-500">Next of Kin:</span> <span className="text-gray-900">{selected.nextOfKin || "-"}</span></div>
                  <div><span className="text-gray-500">Kin Phone:</span> <span className="text-gray-900">{selected.nextOfKinPhone || "-"}</span></div>
                </div>
              </div>

              {/* B. Medical History */}
              <div>
                <h4 className="font-bold text-[#2d5a3d] mb-2">B. Medical History</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  <div><span className="text-gray-500">Medical Condition:</span> <span className="text-gray-900">{selected.hasMedicalCondition ? `Yes - ${selected.medicalConditionDetails}` : "No"}</span></div>
                  <div><span className="text-gray-500">On Medication:</span> <span className="text-gray-900">{selected.onMedication ? `Yes - ${selected.medicationDetails}` : "No"}</span></div>
                  <div><span className="text-gray-500">Allergies:</span> <span className="text-gray-900">{selected.hasAllergies ? `Yes - ${selected.allergyDetails}` : "No"}</span></div>
                  <div><span className="text-gray-500">Past Surgeries:</span> <span className="text-gray-900">{selected.pastSurgeries || "None"}</span></div>
                </div>
              </div>

              {/* C. Vitals */}
              {(selected.pulseRate || selected.respiratoryRate || selected.bloodPressure || selected.bloodSugarLevel) && (
                <div>
                  <h4 className="font-bold text-[#2d5a3d] mb-2">C. Vitals</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                    {selected.pulseRate && <div><span className="text-gray-500">Pulse Rate:</span> <span className="text-gray-900">{selected.pulseRate} bpm</span></div>}
                    {selected.respiratoryRate && <div><span className="text-gray-500">Respiratory Rate:</span> <span className="text-gray-900">{selected.respiratoryRate} /min</span></div>}
                    {selected.bloodPressure && <div><span className="text-gray-500">Blood Pressure:</span> <span className="text-gray-900">{selected.bloodPressure} mmHg</span></div>}
                    {selected.bloodSugarLevel && <div><span className="text-gray-500">Blood Sugar:</span> <span className="text-gray-900">{selected.bloodSugarLevel} mmol/L</span></div>}
                  </div>
                </div>
              )}

              {/* D. Presenting Complaints */}
              {selected.presentingComplaints && (
                <div>
                  <h4 className="font-bold text-[#2d5a3d] mb-1">D. Presenting Complaints</h4>
                  <div className="text-gray-900 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.presentingComplaints }} />
                </div>
              )}

              {/* E. Doctor's Assessment */}
              {selected.doctorsAssessment && (
                <div>
                  <h4 className="font-bold text-[#2d5a3d] mb-1">E. Doctor&apos;s Assessment &amp; Comments</h4>
                  <div className="text-gray-900 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.doctorsAssessment }} />
                </div>
              )}

              {/* F. Diagnosis */}
              {selected.diagnosis && (
                <div>
                  <h4 className="font-bold text-[#2d5a3d] mb-1">F. Diagnosis</h4>
                  <div className="text-gray-900 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.diagnosis }} />
                </div>
              )}

              {/* G. Treatment */}
              {selected.treatment && (
                <div>
                  <h4 className="font-bold text-[#2d5a3d] mb-1">G. Treatment / Prescription</h4>
                  <div className="text-gray-900 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.treatment }} />
                </div>
              )}

              {/* H. Referral */}
              {(selected.referredTo || selected.reasonForReferral) && (
                <div>
                  <h4 className="font-bold text-[#2d5a3d] mb-2">H. Referral</h4>
                  <div className="space-y-2">
                    {selected.referredTo && (
                      <div>
                        <span className="text-gray-500 text-sm">Referred to:</span>
                        <div className="text-gray-900 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.referredTo }} />
                      </div>
                    )}
                    {selected.reasonForReferral && (
                      <div>
                        <span className="text-gray-500 text-sm">Reason:</span>
                        <div className="text-gray-900 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.reasonForReferral }} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* I. Signatures */}
              {(selected.attendingDoctor || selected.nurseHealthWorker) && (
                <div>
                  <h4 className="font-bold text-[#2d5a3d] mb-2">I. Signatures</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                    <div><span className="text-gray-500">Attending Doctor:</span> <span className="text-gray-900">{selected.attendingDoctor || "-"} {selected.attendingDoctorDate && `(${selected.attendingDoctorDate})`}</span></div>
                    <div><span className="text-gray-500">Nurse/Health Worker:</span> <span className="text-gray-900">{selected.nurseHealthWorker || "-"} {selected.nurseHealthWorkerDate && `(${selected.nurseHealthWorkerDate})`}</span></div>
                  </div>
                </div>
              )}

              {/* Project info */}
              <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 space-y-0.5">
                <p>Project: {selected.projectName || "N/A"}</p>
                <p>Registered: {new Date(selected.createdAt).toLocaleString()}</p>
                {selected.updatedAt && <p>Last updated: {new Date(selected.updatedAt).toLocaleString()}</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
