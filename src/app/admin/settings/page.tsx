"use client";

import { useState } from "react";
import { Shield, Bell, Mail } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    newDonationAlerts: true,
    newPartnerAlerts: true,
    newReportAlerts: true,
    twoFactorAuth: false,
    autoThankYou: false,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your admin preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#e8f0e8] rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#2d5a3d]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Configure email alerts and notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: "emailNotifications", label: "Email Notifications", description: "Receive email notifications for admin activities" },
              { key: "newDonationAlerts", label: "New Donation Alerts", description: "Get notified when someone makes a donation" },
              { key: "newPartnerAlerts", label: "New Partner Alerts", description: "Get notified when someone applies to partner" },
              { key: "newReportAlerts", label: "New Report Alerts", description: "Get notified when a community report is submitted" },
            ].map((item) => (
              <label key={item.key} className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings]}
                  onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                  className="mt-1 w-5 h-5 text-[#2d5a3d] border-gray-300 rounded focus:ring-[#2d5a3d]"
                />
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#e8f0e8] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#2d5a3d]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">Manage security settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                className="mt-1 w-5 h-5 text-[#2d5a3d] border-gray-300 rounded focus:ring-[#2d5a3d]"
              />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </label>
          </div>
        </div>

        {/* Automation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#e8f0e8] rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#2d5a3d]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Automation</h2>
              <p className="text-sm text-gray-500">Automate repetitive tasks</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoThankYou}
                onChange={(e) => setSettings({ ...settings, autoThankYou: e.target.checked })}
                className="mt-1 w-5 h-5 text-[#2d5a3d] border-gray-300 rounded focus:ring-[#2d5a3d]"
              />
              <div>
                <p className="font-medium text-gray-900">Auto Thank You Emails</p>
                <p className="text-sm text-gray-500">Automatically send thank you emails to donors</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
