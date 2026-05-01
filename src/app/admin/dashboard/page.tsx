"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Heart,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface DashboardStats {
  totalDonations: number;
  totalAmount: number;
  totalPartners: number;
  totalReports: number;
  recentDonations: Donation[];
  recentPartners: Partner[];
  recentReports: Report[];
}

interface Donation {
  id: string;
  amount: number;
  name: string;
  email: string;
  createdAt: string;
}

interface Partner {
  id: string;
  name: string;
  email: string;
  partnershipType: string;
  createdAt: string;
}

interface Report {
  id: string;
  communityName: string;
  location: string;
  reporterName: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [donationsRes, partnersRes, reportsRes] = await Promise.all([
        fetch("/api/donations"),
        fetch("/api/partners"),
        fetch("/api/reports"),
      ]);

      const donationsData = donationsRes.ok ? await donationsRes.json() : { donations: [], stats: { totalAmount: 0, totalDonations: 0 } };
      const partnersData = partnersRes.ok ? await partnersRes.json() : { partners: [] };
      const reportsData = reportsRes.ok ? await reportsRes.json() : { reports: [] };

      setStats({
        totalDonations: donationsData.stats?.totalDonations || 0,
        totalAmount: donationsData.stats?.totalAmount || 0,
        totalPartners: partnersData.partners?.length || 0,
        totalReports: reportsData.reports?.length || 0,
        recentDonations: donationsData.donations?.slice(0, 5) || [],
        recentPartners: partnersData.partners?.slice(0, 5) || [],
        recentReports: reportsData.reports?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your organization</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#e8f0e8] rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#2d5a3d]" />
              </div>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalAmount)}</p>
            <p className="text-sm text-gray-600">Total Donations</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                +8%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
            <p className="text-sm text-gray-600">Total Donors</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                +15%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPartners}</p>
            <p className="text-sm text-gray-600">Partners</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <span className="flex items-center text-red-600 text-sm font-medium">
                <ArrowDownRight className="w-4 h-4" />
                -3%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
            <p className="text-sm text-gray-600">Community Reports</p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donations */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Donations</h2>
            <a href="/admin/donations" className="text-sm text-[#2d5a3d] hover:underline">View All</a>
          </div>
          <div className="divide-y divide-gray-100">
            {(stats?.recentDonations?.length ?? 0) > 0 ? (
              stats?.recentDonations?.map((donation: Donation) => (
                <div key={donation.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e8f0e8] rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#2d5a3d]">{donation.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{donation.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(donation.createdAt)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#2d5a3d]">{formatAmount(donation.amount)}</span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">No recent donations</div>
            )}
          </div>
        </div>

        {/* Recent Partners */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Partners</h2>
            <a href="/admin/partners" className="text-sm text-[#2d5a3d] hover:underline">View All</a>
          </div>
          <div className="divide-y divide-gray-100">
            {(stats?.recentPartners?.length ?? 0) > 0 ? (
              stats?.recentPartners?.map((partner: Partner) => (
                <div key={partner.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{partner.name}</p>
                      <p className="text-sm text-gray-500">{partner.partnershipType}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(partner.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">No recent partners</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
