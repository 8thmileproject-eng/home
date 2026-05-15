import clientPromise from "./mongodb";
import { Db, ObjectId } from "mongodb";

export type RecordStage = "registration" | "nursing" | "doctor" | "complete";

export interface StageInfo {
  completedBy: string;
  completedAt: Date;
  name: string;
}

export interface DataEntry {
  _id?: string;
  projectId?: string;
  projectName?: string;
  date?: string;

  stage: RecordStage;
  completedStages: {
    registration?: StageInfo;
    nursing?: StageInfo;
    doctor?: StageInfo;
  };

  // A. Personal Information
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  maritalStatus: string;
  nextOfKin: string;
  nextOfKinPhone: string;

  // B. Medical History
  hasMedicalCondition: boolean;
  medicalConditionDetails: string;
  onMedication: boolean;
  medicationDetails: string;
  hasAllergies: boolean;
  allergyDetails: string;
  pastSurgeries: string;

  // C. Vitals
  pulseRate: string;
  respiratoryRate: string;
  bloodPressure: string;
  bloodSugarLevel: string;

  // D. Presenting Complaints
  presentingComplaints: string;

  // E. Doctor's Assessment
  doctorsAssessment: string;

  // F. Diagnosis
  diagnosis: string;

  // G. Treatment / Prescription
  treatment: string;

  // H. Referral
  referredTo: string;
  reasonForReferral: string;

  // I. Signatures
  attendingDoctor: string;
  attendingDoctorDate: string;
  nurseHealthWorker: string;
  nurseHealthWorkerDate: string;

  createdAt: Date;
  updatedAt?: Date;
}

const DB_NAME = "eighth_mile";
const COLLECTION = "dataEntries";

async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

const STAGE_ORDER: RecordStage[] = ["registration", "nursing", "doctor", "complete"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDoc(doc: any): DataEntry {
  return {
    _id: doc._id.toString(),
    projectId: doc.projectId || undefined,
    projectName: doc.projectName || undefined,
    date: doc.date || undefined,
    stage: doc.stage || "registration",
    completedStages: doc.completedStages || {},
    fullName: doc.fullName || "",
    gender: doc.gender || "",
    dateOfBirth: doc.dateOfBirth || "",
    phoneNumber: doc.phoneNumber || "",
    address: doc.address || "",
    occupation: doc.occupation || "",
    maritalStatus: doc.maritalStatus || "",
    nextOfKin: doc.nextOfKin || "",
    nextOfKinPhone: doc.nextOfKinPhone || "",
    hasMedicalCondition: doc.hasMedicalCondition || false,
    medicalConditionDetails: doc.medicalConditionDetails || "",
    onMedication: doc.onMedication || false,
    medicationDetails: doc.medicationDetails || "",
    hasAllergies: doc.hasAllergies || false,
    allergyDetails: doc.allergyDetails || "",
    pastSurgeries: doc.pastSurgeries || "",
    pulseRate: doc.pulseRate || "",
    respiratoryRate: doc.respiratoryRate || "",
    bloodPressure: doc.bloodPressure || "",
    bloodSugarLevel: doc.bloodSugarLevel || "",
    presentingComplaints: doc.presentingComplaints || "",
    doctorsAssessment: doc.doctorsAssessment || "",
    diagnosis: doc.diagnosis || "",
    treatment: doc.treatment || "",
    referredTo: doc.referredTo || "",
    reasonForReferral: doc.reasonForReferral || "",
    attendingDoctor: doc.attendingDoctor || "",
    attendingDoctorDate: doc.attendingDoctorDate || "",
    nurseHealthWorker: doc.nurseHealthWorker || "",
    nurseHealthWorkerDate: doc.nurseHealthWorkerDate || "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function getAllDataEntries(opts?: { projectId?: string; stage?: RecordStage }): Promise<DataEntry[]> {
  const db = await getDb();
  const filter: Record<string, unknown> = {};
  if (opts?.projectId) filter.projectId = opts.projectId;
  if (opts?.stage) filter.stage = opts.stage;
  const docs = await db.collection(COLLECTION).find(filter).sort({ createdAt: -1 }).toArray();
  return docs.map(mapDoc);
}

export async function getDataEntryById(id: string): Promise<DataEntry | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? mapDoc(doc) : null;
}

export async function insertDataEntry(entry: Partial<DataEntry>): Promise<string | null> {
  const db = await getDb();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...cleanEntry } = entry;
  const result = await db.collection(COLLECTION).insertOne({
    stage: "registration",
    completedStages: {},
    ...cleanEntry,
    createdAt: new Date(),
  });
  return result.acknowledged ? result.insertedId.toString() : null;
}

export async function updateDataEntry(id: string, updates: Partial<DataEntry>): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

export async function advanceRecordStage(
  id: string,
  nextStage: RecordStage,
  fields: Partial<DataEntry>,
  user: { id: string; name: string }
): Promise<boolean> {
  const db = await getDb();
  const stageKey = nextStage === "nursing" ? "nursing" : nextStage === "doctor" ? "doctor" : "registration";

  const stageInfo: StageInfo = {
    completedBy: user.id,
    completedAt: new Date(),
    name: user.name,
  };

  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...fields,
        stage: nextStage,
        [`completedStages.${stageKey}`]: stageInfo,
        updatedAt: new Date(),
      },
    }
  );
  return result.modifiedCount > 0;
}

export async function deleteDataEntry(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
