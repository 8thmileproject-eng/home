"use client";

import { useState, useEffect } from "react";
import { useProject } from "../layout";
import {
  UserPlus,
  Search,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Link as LinkIcon,
  User,
  MessageSquare,
  Star,
  XCircle,
  FileText,
  MoreVertical,
  Eye,
} from "lucide-react";

interface Volunteer {
  _id: string;
  roleId: string;
  roleTitle: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  fieldOfStudy: string;
  occupation: string | null;
  motivation: string;
  uniqueValue: string;
  hoursPerWeek: string;
  availableStartDate: string;
  portfolioLinks: string | null;
  referenceName: string | null;
  referenceRelationship: string | null;
  referenceContact: string | null;
  roleSpecificAnswers: Record<string, string>;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

const ROLE_OPTIONS = [
  { id: "communications-manager", title: "Volunteer Communications Manager" },
  { id: "lead-outreach", title: "Outreach & Community Engagement Unit Lead" },
  { id: "lead-relief", title: "Relief and Welfare Unit Lead" },
  { id: "lead-volunteer-management", title: "Volunteer Management Unit Lead" },
  { id: "lead-safeguarding", title: "Safeguarding & Ethics Unit Lead" },
  { id: "volunteer-nurse", title: "Volunteer Nurse" },
  { id: "volunteer-doctor", title: "Volunteer Doctor" },
  { id: "volunteer-media", title: "Volunteer Media & Content Creator" },
  { id: "volunteer-logistics", title: "Volunteer Logistics & Operations" },
  { id: "volunteer-counsellor", title: "Volunteer Counsellor" },
  { id: "general-volunteer", title: "General Volunteer" },
];

export default function VolunteersAdminPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const { selectedProjectId } = useProject();

  useEffect(() => {
    fetchVolunteers();
  }, [selectedProjectId]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const qs = selectedProjectId ? `?projectId=${selectedProjectId}` : "";
      const res = await fetch(`/api/volunteers${qs}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setVolunteers(data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/volunteers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchVolunteers();
      if (selectedVolunteer && selectedVolunteer._id === id) {
        setSelectedVolunteer({ ...selectedVolunteer, status: status as Volunteer["status"] });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.roleTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    const matchesRole = roleFilter === "all" || v.roleId === roleFilter || v.roleTitle === ROLE_OPTIONS.find(r => r.id === roleFilter)?.title;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-50 text-green-700",
      rejected: "bg-red-50 text-red-700",
      pending: "bg-yellow-50 text-yellow-700",
    };
    const icons: Record<string, React.ReactNode> = {
      approved: <CheckCircle className="w-3.5 h-3.5" />,
      rejected: <XCircle className="w-3.5 h-3.5" />,
      pending: <Clock className="w-3.5 h-3.5" />,
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {icons[status] || icons.pending}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
      </span>
    );
  };

  const exportCSV = () => {
    const headers = ["Full Name", "Email", "Phone", "Location", "Role", "Education", "Field of Study", "Occupation", "Hours/Week", "Start Date", "Motivation", "Unique Value", "Portfolio Links", "Reference Name", "Reference Relationship", "Reference Contact", "Status", "Applied Date"];
    const escapeCSV = (val: string) => {
      if (!val) return "";
      const str = String(val).replace(/"/g, '""');
      return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str}"` : str;
    };
    const rows = filteredVolunteers.map((v) => [
      v.fullName, v.email, v.phone, v.location, v.roleTitle,
      v.education, v.fieldOfStudy, v.occupation || "",
      v.hoursPerWeek, v.availableStartDate, v.motivation, v.uniqueValue,
      v.portfolioLinks || "", v.referenceName || "",
      v.referenceRelationship || "", v.referenceContact || "",
      v.status, v.createdAt ? formatDate(v.createdAt) : "",
    ].map(escapeCSV).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volunteers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const tableRows = filteredVolunteers.map((v) => `
      <tr>
        <td>${v.fullName || ""}</td>
        <td>${v.email || ""}</td>
        <td>${v.phone || ""}</td>
        <td>${v.roleTitle || ""}</td>
        <td>${v.location || ""}</td>
        <td>${v.status?.charAt(0).toUpperCase() + v.status?.slice(1) || "Pending"}</td>
        <td>${v.createdAt ? formatDate(v.createdAt) : ""}</td>
      </tr>
    `).join("");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Volunteer Applications - The 8th Mile Project</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a1a; }
          h1 { font-size: 22px; color: #1a3d2e; margin-bottom: 4px; }
          p.subtitle { color: #666; font-size: 13px; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #1a3d2e; color: white; text-align: left; padding: 10px 12px; font-weight: 600; }
          td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
          tr:nth-child(even) td { background: #f9fafb; }
          .footer { margin-top: 32px; font-size: 11px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>Volunteer Applications</h1>
        <p class="subtitle">The 8th Mile Project · Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · ${filteredVolunteers.length} record(s)</p>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Location</th><th>Status</th><th>Applied</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div class="footer">The 8th Mile Project © ${new Date().getFullYear()} · Abuja, Nigeria</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Volunteers</h1>
          <p className="text-gray-600 mt-1">
            {volunteers.length} application{volunteers.length !== 1 ? "s" : ""} total
            {volunteers.filter((v) => v.status === "pending").length > 0 &&
              ` · ${volunteers.filter((v) => v.status === "pending").length} pending review`}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex-1 sm:flex-none"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex-1 sm:flex-none"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all bg-white"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]"
            >
              <option value="all">All Roles</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role.id} value={role.id}>{role.title}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Applied</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-[#2d5a3d] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <UserPlus className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-base font-medium text-gray-900">No volunteers found</p>
                    <p className="text-sm">Try adjusting your search filters.</p>
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((volunteer) => (
                  <tr
                    key={volunteer._id}
                    onClick={() => setSelectedVolunteer(volunteer)}
                    className="hover:bg-[#f0faf4] transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e8f0e8] flex items-center justify-center text-[#2d5a3d] font-bold flex-shrink-0">
                          {volunteer.fullName?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{volunteer.fullName}</p>
                          <p className="text-sm text-gray-500 truncate">{volunteer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {volunteer.roleTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{volunteer.location || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(volunteer.createdAt || new Date().toISOString())}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(volunteer.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === volunteer._id ? null : volunteer._id); }}
                          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openActionId === volunteer._id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setOpenActionId(null); }} />
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-40">
                              <button onClick={(e) => { e.stopPropagation(); setOpenActionId(null); setSelectedVolunteer(volunteer); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <Eye className="w-4 h-4 text-gray-400" /> View Details
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setOpenActionId(null); updateStatus(volunteer._id, "approved"); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors">
                                <CheckCircle className="w-4 h-4" /> Approve
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setOpenActionId(null); updateStatus(volunteer._id, "pending"); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-yellow-700 hover:bg-yellow-50 transition-colors">
                                <Clock className="w-4 h-4" /> Set Pending
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button onClick={(e) => { e.stopPropagation(); setOpenActionId(null); updateStatus(volunteer._id, "rejected"); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Slide-Out Panel */}
      {selectedVolunteer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedVolunteer(null)}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right">
            {/* Panel Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Volunteer Details</h2>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#e8f0e8] flex items-center justify-center text-[#1a3d2e] text-2xl font-bold flex-shrink-0">
                  {selectedVolunteer.fullName?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-gray-900">{selectedVolunteer.fullName}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mt-1">
                    {selectedVolunteer.roleTitle}
                  </span>
                </div>
              </div>

              {/* Status + Actions */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Current Status</p>
                  {getStatusBadge(selectedVolunteer.status)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedVolunteer._id, "approved")}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(selectedVolunteer._id, "rejected")}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2d5a3d]" />
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <a href={`mailto:${selectedVolunteer.email}`} className="text-sm font-medium text-[#2d5a3d] hover:underline truncate block">
                        {selectedVolunteer.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <a href={`tel:${selectedVolunteer.phone}`} className="text-sm font-medium text-gray-900 hover:underline">
                        {selectedVolunteer.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{selectedVolunteer.location || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Work */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#2d5a3d]" />
                  Education & Work
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500">Education Level</p>
                      <p className="text-sm font-medium text-gray-900">{selectedVolunteer.education || "—"}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500">Field of Study</p>
                      <p className="text-sm font-medium text-gray-900">{selectedVolunteer.fieldOfStudy || "—"}</p>
                    </div>
                  </div>
                  {selectedVolunteer.occupation && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Occupation</p>
                        <p className="text-sm font-medium text-gray-900">{selectedVolunteer.occupation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2d5a3d]" />
                  Availability
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Hours per Week</p>
                    <p className="text-sm font-medium text-gray-900">{selectedVolunteer.hoursPerWeek || "—"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Available Start Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedVolunteer.availableStartDate
                        ? formatDate(selectedVolunteer.availableStartDate)
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#2d5a3d]" />
                  Motivation
                </h4>
                <div className="p-4 bg-[#f0faf4] rounded-xl border border-[#d1e7dd]">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedVolunteer.motivation || "No motivation provided."}</p>
                </div>
              </div>

              {/* Unique Value */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#2d5a3d]" />
                  What They Bring
                </h4>
                <div className="p-4 bg-[#f0faf4] rounded-xl border border-[#d1e7dd]">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedVolunteer.uniqueValue || "Not specified."}</p>
                </div>
              </div>

              {/* Portfolio Links */}
              {selectedVolunteer.portfolioLinks && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-[#2d5a3d]" />
                    Portfolio / Links
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-[#2d5a3d] break-all">{selectedVolunteer.portfolioLinks}</p>
                  </div>
                </div>
              )}

              {/* Reference */}
              {selectedVolunteer.referenceName && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#2d5a3d]" />
                    Reference
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedVolunteer.referenceName}</p>
                    </div>
                    {selectedVolunteer.referenceRelationship && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Relationship</p>
                        <p className="text-sm font-medium text-gray-900">{selectedVolunteer.referenceRelationship}</p>
                      </div>
                    )}
                    {selectedVolunteer.referenceContact && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="text-sm font-medium text-gray-900">{selectedVolunteer.referenceContact}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Role-Specific Answers */}
              {selectedVolunteer.roleSpecificAnswers &&
                Object.keys(selectedVolunteer.roleSpecificAnswers).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#2d5a3d]" />
                      Role-Specific Answers
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(selectedVolunteer.roleSpecificAnswers).map(([question, answer]) => (
                        <div key={question} className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-xs font-medium text-gray-500 mb-1">{question}</p>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Meta */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Applied: {formatDate(selectedVolunteer.createdAt || new Date().toISOString())}</span>
                  {selectedVolunteer.updatedAt && (
                    <span>Updated: {formatDate(selectedVolunteer.updatedAt)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
