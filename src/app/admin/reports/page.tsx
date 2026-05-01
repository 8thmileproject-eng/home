"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

interface Report {
  id: string;
  communityName: string;
  location: string;
  reporterName: string;
  phone: string;
  email?: string;
  description: string;
  createdAt: string;
  reviewed: boolean;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingReviewed, setMarkingReviewed] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) throw new Error("Failed to fetch reports");
      
      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      setError("Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsReviewed = async (reportId: string) => {
    setMarkingReviewed(reportId);
    
    try {
      const response = await fetch(`/api/reports/${reportId}/review`, {
        method: "POST",
      });
      
      if (response.ok) {
        setReports(prev => 
          prev.map(r => 
            r.id === reportId ? { ...r, reviewed: true } : r
          )
        );
      }
    } catch (err) {
      console.error("Error marking as reviewed:", err);
    } finally {
      setMarkingReviewed(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-4 px-4 py-2 bg-[#2d5a3d] text-white rounded-lg hover:bg-[#1e3d2a] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community Reports</h1>
        <p className="text-gray-600 mt-1">Review and manage community intervention reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Reports", value: reports.length, icon: FileText },
          { label: "Pending Review", value: reports.filter(r => !r.reviewed).length, icon: AlertTriangle },
          { label: "Reviewed", value: reports.filter(r => r.reviewed).length, icon: CheckCircle2 },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#e8f0e8] rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#2d5a3d]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Community Reports</h2>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reports yet</p>
            <p className="text-sm text-gray-400 mt-1">Community reports will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report.id} className={`px-6 py-6 hover:bg-gray-50 transition-colors ${!report.reviewed ? "border-l-4 border-l-[#4ade80]" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{report.communityName}</h3>
                      {!report.reviewed && (
                        <span className="px-2 py-1 bg-[#4ade80]/20 text-[#1a3d2e] rounded-full text-xs font-semibold">
                          New
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {report.location}
                      </span>
                      <span>•</span>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>

                    <p className="text-gray-700 mb-4 max-w-3xl">{report.description}</p>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <FileText className="w-4 h-4" />
                        {report.reporterName}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-4 h-4" />
                        {report.phone}
                      </span>
                      {report.email && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {report.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    {report.reviewed ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Reviewed
                      </span>
                    ) : (
                      <button
                        onClick={() => markAsReviewed(report.id)}
                        disabled={markingReviewed === report.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d5a3d] text-white rounded-lg hover:bg-[#1e3d2a] transition-colors disabled:opacity-50 text-sm"
                      >
                        {markingReviewed === report.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Mark Reviewed
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
