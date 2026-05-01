"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Mail,
  CheckCircle2,
  Building2,
  Church,
  GraduationCap,
  Briefcase,
  AlertCircle,
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  partnershipType: string;
  description?: string;
  createdAt: string;
  contacted: boolean;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingContact, setSendingContact] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/partners");
      if (!response.ok) throw new Error("Failed to fetch partners");
      
      const data = await response.json();
      setPartners(data.partners || []);
    } catch (err) {
      setError("Failed to load partners");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendContact = async (partnerId: string, email: string, name: string) => {
    setSendingContact(partnerId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(`/api/partners/${partnerId}/contact`, {
        method: "POST",
      });
      
      if (response.ok) {
        setPartners(prev => 
          prev.map(p => 
            p.id === partnerId ? { ...p, contacted: true } : p
          )
        );
        
        alert(`Contact email sent to ${name} at ${email}`);
      }
    } catch (err) {
      console.error("Error sending contact:", err);
      alert("Failed to send contact email");
    } finally {
      setSendingContact(null);
    }
  };

  const getPartnerIcon = (type: string) => {
    switch (type) {
      case "corporate": return Building2;
      case "church": return Church;
      case "academic": return GraduationCap;
      case "professional": return Briefcase;
      default: return Users;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
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
            onClick={fetchPartners}
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
        <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
        <p className="text-gray-600 mt-1">Manage partner applications and contacts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Partners", value: partners.length, icon: Users },
          { label: "Corporate", value: partners.filter(p => p.partnershipType === "corporate").length, icon: Building2 },
          { label: "Church", value: partners.filter(p => p.partnershipType === "church").length, icon: Church },
          { label: "Pending Contact", value: partners.filter(p => !p.contacted).length, icon: Mail },
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

      {/* Partners List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Partner Applications</h2>
        </div>

        {partners.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No partners yet</p>
            <p className="text-sm text-gray-400 mt-1">Partner applications will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {partners.map((partner) => {
              const PartnerIcon = getPartnerIcon(partner.partnershipType);
              return (
                <div key={partner.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#e8f0e8] rounded-xl flex items-center justify-center flex-shrink-0">
                        <PartnerIcon className="w-6 h-6 text-[#2d5a3d]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{partner.name}</h3>
                        <p className="text-sm text-gray-500">{partner.email}</p>
                        {partner.phone && (
                          <p className="text-sm text-gray-500">{partner.phone}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 bg-[#e8f0e8] text-[#2d5a3d] rounded-full text-xs font-semibold capitalize">
                            {partner.partnershipType}
                          </span>
                          <span className="text-xs text-gray-400">{formatDate(partner.createdAt)}</span>
                        </div>
                        {partner.description && (
                          <p className="text-sm text-gray-600 mt-2 max-w-xl">{partner.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {partner.contacted ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Contacted
                        </span>
                      ) : (
                        <button
                          onClick={() => sendContact(partner.id, partner.email, partner.name)}
                          disabled={sendingContact === partner.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d5a3d] text-white rounded-lg hover:bg-[#1e3d2a] transition-colors disabled:opacity-50 text-sm"
                        >
                          {sendingContact === partner.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4" />
                              Contact
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
