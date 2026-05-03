import { MongoClient, MongoClientOptions } from "mongodb";

const MONGODB_URI = process.env.Mongodb || "";

if (!MONGODB_URI) {
  console.warn("Warning: Mongodb env variable is not set");
}

const options: MongoClientOptions = {
  tls: true,
  tlsAllowInvalidCertificates: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Use global variable in dev to preserve connection across HMR
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;
