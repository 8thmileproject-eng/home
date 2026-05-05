import clientPromise from "./mongodb";
import { Db, ObjectId } from "mongodb";

export interface Project {
  _id?: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  startDate?: string;
  endDate?: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const DB_NAME = "eighth_mile";
const COLLECTION = "projects";

async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

function mapDoc(doc: any): Project {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    description: doc.description || "",
    status: doc.status || "inactive",
    startDate: doc.startDate || undefined,
    endDate: doc.endDate || undefined,
    coverImage: doc.coverImage || undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(mapDoc);
}

export async function getActiveProject(): Promise<Project | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ status: "active" });
  return doc ? mapDoc(doc) : null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? mapDoc(doc) : null;
}

export async function insertProject(project: Omit<Project, "_id">): Promise<string | null> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne({
    ...project,
    createdAt: new Date(),
  });
  return result.acknowledged ? result.insertedId.toString() : null;
}

export async function updateProject(id: string, updates: Partial<Omit<Project, "_id">>): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function setActiveProject(id: string): Promise<boolean> {
  const db = await getDb();
  // Deactivate all projects first
  await db.collection(COLLECTION).updateMany(
    { status: "active" },
    { $set: { status: "inactive", updatedAt: new Date() } }
  );
  // Activate the selected one
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "active", updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

export async function deactivateProject(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "inactive", updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}
