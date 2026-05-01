// Simple admin authentication
// In production, use a proper auth system like NextAuth.js or Clerk

const ADMIN_CREDENTIALS = {
  email: "admin@8thmileproject.org",
  password: "admin123", // In production, use hashed passwords
};

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export function authenticateAdmin(email: string, password: string): AdminUser | null {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      email: ADMIN_CREDENTIALS.email,
      name: "Admin User",
      role: "admin",
    };
  }
  return null;
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_token") === "authenticated";
  }
  return false;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  }
}

export function getAdminUser(): AdminUser | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("admin_user");
    if (user) {
      return JSON.parse(user);
    }
  }
  return null;
}

export function setAdminSession(user: AdminUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_token", "authenticated");
    localStorage.setItem("admin_user", JSON.stringify(user));
  }
}
