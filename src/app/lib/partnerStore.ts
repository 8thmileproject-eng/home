import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "8thmileproject";
const COLLECTION = "partners";

export interface Partner {
  _id?: string;
  projectId?: string | null;
  projectName?: string | null;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  partnershipType: string;
  description?: string;
  createdAt: string;
  contacted: boolean;
}

async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

function mapDoc(doc: any): Partner {
  return {
    _id: doc._id.toString(),
    projectId: doc.projectId || null,
    projectName: doc.projectName || null,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    birthday: doc.birthday,
    partnershipType: doc.partnershipType,
    description: doc.description,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
    contacted: doc.contacted || false,
  };
}

export async function addPartner(data: {
  projectId?: string | null;
  projectName?: string | null;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  partnershipType: string;
  description?: string;
}): Promise<Partner> {
  const db = await getDb();
  const doc = {
    ...data,
    contacted: false,
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return mapDoc({ ...doc, _id: result.insertedId });
}

export async function getAllPartners(projectId?: string | null): Promise<Partner[]> {
  const db = await getDb();
  const filter: Record<string, any> = {};
  if (projectId) filter.projectId = projectId;
  const docs = await db.collection(COLLECTION).find(filter).sort({ createdAt: -1 }).toArray();
  return docs.map(mapDoc);
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? mapDoc(doc) : null;
}

export async function markPartnerContacted(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { contacted: true } }
  );
  return result.modifiedCount > 0;
}

export async function getPartnerStats(projectId?: string | null) {
  const db = await getDb();
  const filter: Record<string, any> = {};
  if (projectId) filter.projectId = projectId;
  const partners = await db.collection(COLLECTION).find(filter).toArray();

  const total = partners.length;
  const contacted = partners.filter((p) => p.contacted).length;

  return {
    totalPartners: total,
    contactedCount: contacted,
    pendingCount: total - contacted,
  };
}
