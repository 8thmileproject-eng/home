import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "8thmileproject";
const COLLECTION = "donations";

export interface Donation {
  _id?: string;
  projectId?: string | null;
  projectName?: string | null;
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

async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

function mapDoc(doc: any): Donation {
  return {
    _id: doc._id.toString(),
    projectId: doc.projectId || null,
    projectName: doc.projectName || null,
    amount: doc.amount,
    frequency: doc.frequency,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    message: doc.message,
    isAnonymous: doc.isAnonymous || false,
    coverFees: doc.coverFees || false,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
    thanked: doc.thanked || false,
  };
}

export async function addDonation(data: {
  projectId?: string | null;
  projectName?: string | null;
  amount: number;
  frequency: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  isAnonymous: boolean;
  coverFees: boolean;
}): Promise<Donation> {
  const db = await getDb();
  const doc = {
    ...data,
    thanked: false,
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return {
    ...mapDoc({ ...doc, _id: result.insertedId }),
  };
}

export async function getAllDonations(projectId?: string | null): Promise<Donation[]> {
  const db = await getDb();
  const filter: Record<string, any> = {};
  if (projectId) filter.projectId = projectId;
  const docs = await db.collection(COLLECTION).find(filter).sort({ createdAt: -1 }).toArray();
  return docs.map(mapDoc);
}

export async function getDonationById(id: string): Promise<Donation | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? mapDoc(doc) : null;
}

export async function markDonationThanked(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { thanked: true } }
  );
  return result.modifiedCount > 0;
}

export async function getDonationStats(projectId?: string | null) {
  const db = await getDb();
  const filter: Record<string, any> = {};
  if (projectId) filter.projectId = projectId;
  const donations = await db.collection(COLLECTION).find(filter).toArray();

  const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const count = donations.length;
  const unthanked = donations.filter((d) => !d.thanked).length;

  return {
    totalAmount: total,
    totalDonations: count,
    unthankedCount: unthanked,
    averageAmount: count > 0 ? total / count : 0,
  };
}
