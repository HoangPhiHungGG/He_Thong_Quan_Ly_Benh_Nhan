// lib/actions/doctor.actions.ts
"use server";

import { Query } from "node-appwrite";
import { DOCTOR_COLLECTION_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";

// LẤY THÔNG TIN BÁC SĨ DỰA TRÊN USER ID
export const getDoctorByUserId = async (userId: string) => {
  try {
    const doctors = await databases.listDocuments(
      process.env.DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      [Query.equal("userId", userId)]
    );
    return parseStringify(doctors.documents[0]);
  } catch (error) {
    console.error("Error getting doctor by user ID:", error);
    return null;
  }
};
