"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Mail,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
} from "lucide-react";

interface Donation {
  id: string;
  amount: number;
  frequency: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  isAnonymous: boolean;
  coverFees: boolean;
  createdAt: string;
  thanked: boolean;
}

interface Stats {
  totalAmount: number;
  totalDonations: number;
  unthankedCount: number;
  averageAmount: number;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingThankYou, setSendingThankYou] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch("/api/donations");
      if (!response.ok) throw new Error("Failed to fetch donations");
      
      const data = await response.json();
      setDonations(data.donations);
      setStats(data.stats);
    } catch (err) {
      setError("Failed to load donations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendThankYou = async (donationId: string, email: string, name: string) => {
    setSendingThankYou(donationId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(`/api/donations/${donationId}/thank`, {
        method: "POST",
      });
      
      if (response.ok) {
        setDonations(prev => 
          prev.map(d => 
            d.id === donationId ? { ...d, thanked: true } : d
          )
        );
        
        if (stats) {
          setStats({
            ...stats,
            unthankedCount: stats.unthankedCount - 1,
          });
        }
        
        alert(`Thank you message sent to ${name} at ${email}`);
      }
    } catch (err) {
      console.error("Error sending thank you:", err);
      alert("Failed to send thank you message");
    } finally {
      setSendingThankYou(null);
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
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

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDonations}
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
        <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
        <p className="text-gray-600 mt-1">Manage and track all donations</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e8f0e8] rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#2d5a3d]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e8f0e8] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#2d5a3d]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e8f0e8] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#2d5a3d]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Donation</p>
                <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.averageAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Needs Thank You</p>
                <p className="text-2xl font-bold text-red-600">{stats.unthankedCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donations Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Donations</h2>
        </div>

        {donations.length === 0 ? (
          <div className="p-12 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No donations yet</p>
            <p className="text-sm text-gray-400 mt-1">Donations will appear here when people contribute</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#e8f0e8] rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-[#2d5a3d]">
                            {donation.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {donation.isAnonymous ? "Anonymous" : donation.name}
                          </p>
                          <p className="text-sm text-gray-500">{donation.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">{formatAmount(donation.amount)}</p>
                        <p className="text-sm text-gray-500 capitalize">{donation.frequency}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{formatDate(donation.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {donation.thanked ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Thanked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!donation.thanked && (
                        <button
                          onClick={() => sendThankYou(donation.id, donation.email, donation.name)}
                          disabled={sendingThankYou === donation.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d5a3d] text-white rounded-lg hover:bg-[#1e3d2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {sendingThankYou === donation.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4" />
                              Send Thank You
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
