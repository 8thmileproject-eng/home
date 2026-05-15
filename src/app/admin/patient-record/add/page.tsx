"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OldAddRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/admin/patient-record/registration"); }, [router]);
  return null;
}
