"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientRecordPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/admin/patient-record/dashboard"); }, [router]);
  return null;
}
