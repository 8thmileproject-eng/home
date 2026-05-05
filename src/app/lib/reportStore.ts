import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "8thmileproject";
const COLLECTION = "community_reports";

export interface CommunityReport {
  _id?: string;
  projectId?: string | null;
  projectName?: string | null;
  communityName: string;
  location: string;
  reporterName: string;
  phone: string;
  email?: string;
  description: string;
  createdAt: string;
  reviewed: boolean;
}

async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

function mapDoc(doc: any): CommunityReport {
  return {
    _id: doc._id.toString(),
    projectId: doc.projectId || null,
    projectName: doc.projectName || null,
    communityName: doc.communityName,
    location: doc.location,
    reporterName: doc.reporterName,
    phone: doc.phone,
    email: doc.email,
    description: doc.description,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
    reviewed: doc.reviewed || false,
  };
}

export async function addReport(data: {
  projectId?: string | null;
  projectName?: string | null;
  communityName: string;
  location: string;
  reporterName: string;
  phone: string;
  email?: string;
  description: string;
}): Promise<CommunityReport> {
  const db = await getDb();
  const doc = {
    ...data,
    reviewed: false,
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return mapDoc({ ...doc, _id: result.insertedId });
}

export async function getAllReports(projectId?: string | null): Promise<CommunityReport[]> {
  const db = await getDb();
  const filter: Record<string, any> = {};
  if (projectId) filter.projectId = projectId;
  const docs = await db.collection(COLLECTION).find(filter).sort({ createdAt: -1 }).toArray();
  return docs.map(mapDoc);
}

export async function getReportById(id: string): Promise<CommunityReport | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? mapDoc(doc) : null;
}

export async function markReportReviewed(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { reviewed: true } }
  );
  return result.modifiedCount > 0;
}

export async function getReportStats(projectId?: string | null) {
  const db = await getDb();
  const filter: Record<string, any> = {};
  if (projectId) filter.projectId = projectId;
  const reports = await db.collection(COLLECTION).find(filter).toArray();

  const total = reports.length;
  const reviewed = reports.filter((r) => r.reviewed).length;

  return {
    totalReports: total,
    reviewedCount: reviewed,
    pendingCount: total - reviewed,
  };
}
