import clientPromise from "./mongodb";
import { Db } from "mongodb";

export interface UserCounts {
  email: string;
  name: string;
  registrationCount: number;
  nursingCount: number;
  doctorCount: number;
}

const DB_NAME = "eighth_mile";
const COLLECTION = "userCounts";

async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export async function getCounts(email: string): Promise<UserCounts | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ email });
  if (!doc) return null;
  return {
    email: doc.email,
    name: doc.name || "",
    registrationCount: doc.registrationCount || 0,
    nursingCount: doc.nursingCount || 0,
    doctorCount: doc.doctorCount || 0,
  };
}

export async function incrementCount(email: string, name: string, type: "registration" | "nursing" | "doctor"): Promise<boolean> {
  const db = await getDb();
  const field = `${type}Count`;
  const result = await db.collection(COLLECTION).updateOne(
    { email },
    { $inc: { [field]: 1 }, $setOnInsert: { name, email } },
    { upsert: true }
  );
  return result.acknowledged;
}
