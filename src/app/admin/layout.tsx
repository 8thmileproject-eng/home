"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Heart,
  Users,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  Mail,
  FolderKanban,
  ChevronDown,
  Check,
  Layers,
  ClipboardList,
  Plus,
  List,
} from "lucide-react";

const SUB_ROLE_PAGE_ACCESS: Record<string, string[]> = {
  "data-entry": ["registration"],
  nurse: ["nursing"],
  doctor: ["doctor"],
  pharmacy: [],
  other: [],
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface Project {
  _id: string;
  name: string;
  status: string;
}

// Context for the selected project — all admin pages can read this
export const ProjectContext = createContext<{
  selectedProjectId: string | null;
  selectedProjectName: string;
  setSelectedProjectId: (id: string | null) => void;
}>({
  selectedProjectId: null,
  selectedProjectName: "All Projects",
  setSelectedProjectId: () => {},
});

export function useProject() {
  return useContext(ProjectContext);
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
  { icon: Heart, label: "Donations", href: "/admin/donations" },
  { icon: Users, label: "Partners", href: "/admin/partners" },
  { icon: UserPlus, label: "Volunteers", href: "/admin/volunteers" },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
  { icon: Mail, label: "Communication", href: "/admin/communications" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role?: string; permissions?: string[] } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [patientRecordOpen, setPatientRecordOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router, pathname]);

  // Fetch projects for the switcher
  useEffect(() => {
    if (pathname === "/admin/login" || !user) return;

    fetch("/api/admin/projects")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.projects) {
          setProjects(data.projects);
          // Auto-select active project if none selected
          const stored = localStorage.getItem("selectedProjectId");
          if (stored === "all") {
            setSelectedProjectId(null); // Keep it as null in state
          } else if (stored && data.projects.some((p: Project) => p._id === stored)) {
            setSelectedProjectId(stored);
          } else if (data.activeProjectId) {
            setSelectedProjectId(data.activeProjectId);
          }
        }
      })
      .catch(() => {});
  }, [user, pathname]);

  // Persist selection
  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem("selectedProjectId", selectedProjectId);
    } else {
      localStorage.setItem("selectedProjectId", "all");
    }
  }, [selectedProjectId]);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2d5a3d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedProject = projects.find((p) => p._id === selectedProjectId);
  const selectedProjectName = selectedProject?.name || "All Projects";

  return (
    <ProjectContext.Provider value={{ selectedProjectId, selectedProjectName, setSelectedProjectId }}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a3d2e] text-white transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image src="/logo.svg" alt="8th Mile Project" fill className="object-contain" />
                </div>
                <div>
                  <p className="font-bold text-lg">Admin</p>
                  <p className="text-xs text-white/60">8th Mile Project</p>
                </div>
              </div>
            </div>

            {/* Project Switcher */}
            {user.role === "super_admin" && projects.length > 0 && (
              <div className="px-4 pt-4 pb-2">
                <div className="relative">
                  <button
                    onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl transition-colors text-sm"
                  >
                    <Layers className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
                    <span className="flex-1 text-left truncate font-medium">{selectedProjectName}</span>
                    <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${projectDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {projectDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#143324] rounded-xl border border-white/10 shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
                      <button
                        onClick={() => { setSelectedProjectId(null); setProjectDropdownOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/10 transition-colors ${!selectedProjectId ? "bg-white/10 text-[#4ade80]" : "text-white/70"}`}
                      >
                        <Layers className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left">All Projects</span>
                        {!selectedProjectId && <Check className="w-4 h-4" />}
                      </button>
                      {projects.map((project) => (
                        <button
                          key={project._id}
                          onClick={() => { setSelectedProjectId(project._id); setProjectDropdownOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/10 transition-colors ${selectedProjectId === project._id ? "bg-white/10 text-[#4ade80]" : "text-white/70"}`}
                        >
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${project.status === "active" ? "bg-[#4ade80]" : "bg-white/30"}`} />
                          <span className="flex-1 text-left truncate">{project.name}</span>
                          {selectedProjectId === project._id && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto min-h-0">
              {sidebarItems.map((item) => {
                const pageId = item.href.split("/").pop() || "";
                
                let hasAccess = false;
                if (user.role === "super_admin") {
                  hasAccess = true;
                } else if (pageId === "dashboard" || pageId === "projects") {
                  hasAccess = false;
                } else {
                  hasAccess = !!(user.permissions && user.permissions.includes(pageId));
                }
                
                if (!hasAccess) return null;

                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#4ade80] text-[#1a3d2e] font-semibold"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}

              {/* Patient Record - dropdown section */}
              {(() => {
                const perms = user.permissions || [];
                const subRole = (user as { subRole?: string }).subRole;
                const hasPatientRecord = user.role === "super_admin" || perms.includes("patient-record") || perms.some((p: string) => p.startsWith("patient-record-"));
                if (!hasPatientRecord) return null;

                const isInSection = pathname.startsWith("/admin/patient-record");
                return (
                  <div>
                    <button
                      onClick={() => setPatientRecordOpen(!patientRecordOpen)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isInSection
                          ? "bg-[#4ade80] text-[#1a3d2e] font-semibold"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <ClipboardList className="w-5 h-5" />
                      <span className="flex-1 text-left">Patient Record</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${patientRecordOpen ? "rotate-180" : ""}`} />
                    </button>

                    {patientRecordOpen && (
                      <div className="ml-2 mt-1 space-y-0.5">
                        {[
                          { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/admin/patient-record/dashboard" },
                          { id: "registration", icon: Plus, label: "Registration", href: "/admin/patient-record/registration" },
                          { id: "nursing", icon: Heart, label: "Nursing", href: "/admin/patient-record/nursing" },
                          { id: "doctor", icon: UserPlus, label: "Doctor", href: "/admin/patient-record/doctor" },
                          { id: "list", icon: List, label: "View Record", href: "/admin/patient-record/list" },
                        ].filter((sub) => {
                          if (user.role === "super_admin") return true;
                          if (perms.includes("patient-record")) return true;
                          if (perms.includes(`patient-record-${sub.id}`)) return true;
                          if (subRole && (SUB_ROLE_PAGE_ACCESS[subRole] || []).includes(sub.id)) return true;
                          return false;
                        }).map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                                isSubActive
                                  ? "bg-white/20 text-white font-semibold"
                                  : "text-white/60 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-white/10">
              <div className="px-4 py-3 mb-3">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-white/60">{user.email}</p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <p className="font-bold text-gray-900">Admin Dashboard</p>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
            <p className="text-sm text-gray-600">Are you sure you want to log out?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </ProjectContext.Provider>
  );
}
