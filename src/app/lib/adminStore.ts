import clientPromise from "./mongodb";
import { Db, ObjectId } from "mongodb";

export interface Admin {
  _id?: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  disabled: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface AdminRole {
  _id?: string;
  name: string;
  permissions: string[];
  createdAt: Date;
}

export const ADMIN_PAGES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "projects", label: "Projects" },
  { id: "donations", label: "Donations" },
  { id: "partners", label: "Partners" },
  { id: "volunteers", label: "Volunteers" },
  { id: "reports", label: "Reports" },
  { id: "communications", label: "Communication" },
  { id: "settings", label: "Settings" },
];

async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("eighth_mile");
}

// ─── Admin Users ───

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const db = await getDb();
  const admin = await db.collection("admins").findOne({ email });
  if (!admin) return null;
  return {
    _id: admin._id.toString(),
    email: admin.email,
    passwordHash: admin.passwordHash,
    name: admin.name,
    role: admin.role,
    disabled: admin.disabled || false,
    permissions: admin.permissions || [],
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}

export async function getAdminById(id: string): Promise<Admin | null> {
  const db = await getDb();
  const admin = await db.collection("admins").findOne({ _id: new ObjectId(id) });
  if (!admin) return null;
  return {
    _id: admin._id.toString(),
    email: admin.email,
    passwordHash: admin.passwordHash,
    name: admin.name,
    role: admin.role,
    disabled: admin.disabled || false,
    permissions: admin.permissions || [],
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}

export async function getAllAdmins(): Promise<Admin[]> {
  const db = await getDb();
  const admins = await db.collection("admins").find({}).sort({ createdAt: -1 }).toArray();
  return admins.map((a) => ({
    _id: a._id.toString(),
    email: a.email,
    passwordHash: a.passwordHash,
    name: a.name,
    role: a.role,
    disabled: a.disabled || false,
    permissions: a.permissions || [],
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));
}

export async function insertAdmin(admin: Omit<Admin, "_id">): Promise<boolean> {
  const db = await getDb();
  const existing = await db.collection("admins").findOne({ email: admin.email });
  if (existing) return false;
  const result = await db.collection("admins").insertOne({
    ...admin,
    disabled: admin.disabled || false,
    permissions: admin.permissions || [],
    createdAt: new Date(),
  });
  return result.acknowledged;
}

export async function updateAdmin(id: string, updates: Partial<Omit<Admin, "_id">>): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection("admins").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

export async function deleteAdmin(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection("admins").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// ─── Roles ───

export async function getAllRoles(): Promise<AdminRole[]> {
  const db = await getDb();
  const roles = await db.collection("admin_roles").find({}).sort({ createdAt: -1 }).toArray();
  return roles.map((r) => ({
    _id: r._id.toString(),
    name: r.name,
    permissions: r.permissions || [],
    createdAt: r.createdAt,
  }));
}

export async function insertRole(role: Omit<AdminRole, "_id">): Promise<boolean> {
  const db = await getDb();
  const existing = await db.collection("admin_roles").findOne({ name: role.name });
  if (existing) return false;
  const result = await db.collection("admin_roles").insertOne({
    ...role,
    createdAt: new Date(),
  });
  return result.acknowledged;
}

export async function updateRole(id: string, updates: Partial<Omit<AdminRole, "_id">>): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection("admin_roles").updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

export async function deleteRole(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection("admin_roles").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
