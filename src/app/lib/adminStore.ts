import clientPromise from "./mongodb";
import { Db } from "mongodb";

export interface Admin {
  _id?: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: Date;
}

async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("eighth_mile"); // Use appropriate db name, defaults to eighth_mile or the one in URI
}

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
    createdAt: admin.createdAt,
  };
}

export async function insertAdmin(admin: Omit<Admin, "_id">): Promise<boolean> {
  const db = await getDb();
  const existing = await db.collection("admins").findOne({ email: admin.email });
  if (existing) {
    return false; // Already exists
  }
  const result = await db.collection("admins").insertOne({
    ...admin,
    createdAt: new Date(),
  });
  return result.acknowledged;
}
