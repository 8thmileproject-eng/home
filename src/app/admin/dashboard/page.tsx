"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Heart,
  FileText,
  DollarSign,
  UserPlus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle,
  ExternalLink,
  Activity,
} from "lucide-react";
import { useProject } from "../layout";

interface Stats {
  totalDonations: number;
  totalAmount: number;
  totalPartners: number;
  totalReports: number;
  totalVolunteers: number;
  pendingVolunteers: number;
  recentDonations: Array<{
    _id?: string;
    id?: string;
    amount: number;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentVolunteers: Array<{
    _id?: string;
    fullName: string;
    email: string;
    roleTitle: string;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedProjectId, selectedProjectName } = useProject();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const qs = selectedProjectId ? `?projectId=${selectedProjectId}` : "";
        const results = await Promise.allSettled([
          fetch(`/api/donations${qs}`).then((r) => (r.ok ? r.json() : null)),
          fetch(`/api/partners${qs}`).then((r) => (r.ok ? r.json() : null)),
          fetch(`/api/reports${qs}`).then((r) => (r.ok ? r.json() : null)),
          fetch(`/api/volunteers${qs}`).then((r) => (r.ok ? r.json() : null)),
        ]);

        const donationsData = results[0].status === "fulfilled" ? results[0].value : null;
        const partnersData = results[1].status === "fulfilled" ? results[1].value : null;
        const reportsData = results[2].status === "fulfilled" ? results[2].value : null;
        const volunteersData = results[3].status === "fulfilled" ? results[3].value : null;

        setStats({
          totalDonations: donationsData?.stats?.totalDonations || 0,
          totalAmount: donationsData?.stats?.totalAmount || 0,
          totalPartners: partnersData?.partners?.length || 0,
          totalReports: reportsData?.reports?.length || 0,
          totalVolunteers: volunteersData?.stats?.total || 0,
          pendingVolunteers: volunteersData?.stats?.pending || 0,
          recentDonations: donationsData?.donations?.slice(0, 5) || [],
          recentVolunteers: volunteersData?.applications?.slice(0, 5) || [],
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setStats({
          totalDonations: 0,
          totalAmount: 0,
          totalPartners: 0,
          totalReports: 0,
          totalVolunteers: 0,
          pendingVolunteers: 0,
          recentDonations: [],
          recentVolunteers: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProjectId]);

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded-xl w-1/3" />
          <div className="h-5 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-gray-200 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded-2xl" />
            <div className="h-80 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Donations",
      value: formatAmount(stats?.totalAmount || 0),
      subtext: `${stats?.totalDonations || 0} donors`,
      icon: DollarSign,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Volunteers",
      value: stats?.totalVolunteers || 0,
      subtext: `${stats?.pendingVolunteers || 0} pending review`,
      icon: UserPlus,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Partners",
      value: stats?.totalPartners || 0,
      subtext: "Active partnerships",
      icon: Users,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      label: "Reports",
      value: stats?.totalReports || 0,
      subtext: "Community reports",
      icon: FileText,
      color: "bg-rose-500",
      lightColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#2d5a3d] font-medium mb-1">
          <Activity className="w-4 h-4" />
          <span>Live Overview</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{getGreeting()}, Admin</h1>
        <p className="text-gray-500 mt-1">
          {selectedProjectId
            ? <>Viewing data for <strong className="text-[#2d5a3d]">{selectedProjectName}</strong></>
            : "Here\u0027s what\u0027s happening across all projects."
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 ${card.lightColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  Active
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/volunteers"
          className="flex items-center gap-3 p-4 bg-[#1a3d2e] text-white rounded-2xl hover:bg-[#143324] transition-colors group"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Review Volunteers</p>
            <p className="text-xs text-white/60">{stats?.pendingVolunteers || 0} pending</p>
          </div>
          <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
        </Link>

        <Link
          href="/admin/donations"
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#2d5a3d]/30 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900">View Donations</p>
            <p className="text-xs text-gray-500">{stats?.totalDonations || 0} total</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>

        <Link
          href="/admin/reports"
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#2d5a3d]/30 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900">Community Reports</p>
            <p className="text-xs text-gray-500">{stats?.totalReports || 0} submitted</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
      </div>

      {/* Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Volunteers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#2d5a3d]" />
              <h2 className="font-bold text-gray-900">Recent Volunteers</h2>
            </div>
            <Link href="/admin/volunteers" className="text-xs font-medium text-[#2d5a3d] hover:underline flex items-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(stats?.recentVolunteers?.length ?? 0) > 0 ? (
              stats?.recentVolunteers?.map((vol) => (
                <div key={vol._id || vol.email} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">{vol.fullName?.charAt(0) || "?"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{vol.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{vol.roleTitle}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                      vol.status === "approved"
                        ? "bg-green-50 text-green-700"
                        : vol.status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {vol.status === "approved" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {vol.status?.charAt(0).toUpperCase() + vol.status?.slice(1) || "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <UserPlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No volunteer applications yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#2d5a3d]" />
              <h2 className="font-bold text-gray-900">Recent Donations</h2>
            </div>
            <Link href="/admin/donations" className="text-xs font-medium text-[#2d5a3d] hover:underline flex items-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(stats?.recentDonations?.length ?? 0) > 0 ? (
              stats?.recentDonations?.map((donation) => (
                <div key={donation._id || donation.id || donation.email} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-emerald-600">{donation.name?.charAt(0) || "?"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{donation.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(donation.createdAt)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm flex-shrink-0">{formatAmount(donation.amount)}</span>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No donations recorded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats Bar */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center gap-6 justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4 text-[#2d5a3d]" />
          <span>Dashboard last updated: <strong className="text-gray-900">{new Date().toLocaleString()}</strong></span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-sm font-medium text-[#2d5a3d] hover:underline"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}
