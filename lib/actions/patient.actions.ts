"use server";

import { ID, Query, InputFile } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
//Create User
// export const createUser = async (user: CreateUserParams) => {
//   try {
//     // Create new user
//     const newuser = await users.create(
//       ID.unique(),
//       user.email,
//       user.phone,
//       undefined,
//       user.name
//     );

//     return parseStringify(newuser);
//   } catch (error: any) {
//     // Check existing user
//     if (error && error?.code === 409) {
//       const existingUser = await users.list([
//         Query.equal("email", [user.email]),
//       ]);

//       return existingUser.users[0];
//     }
//     console.error("An error occurred while creating a new user:", error);
//     return null;
//   }
// };
//
//
export const createUser = async (user: CreateUserParams) => {
  try {
    // Cố gắng tạo user mới
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    return parseStringify(newUser);
  } catch (error: any) {
    // =========================================================
    // SỬA LẠI TOÀN BỘ KHỐI CATCH
    // =========================================================
    // Nếu lỗi là do user đã tồn tại (mã lỗi 409)
    if (error && error.code === 409) {
      // Tìm user đã tồn tại bằng email
      const existingUsers = await users.list([
        Query.equal("email", [user.email]),
      ]);

      // users.list trả về một object có thuộc tính 'users' là một mảng
      // Kiểm tra xem mảng có phần tử không
      if (existingUsers.users.length > 0) {
        // Trả về user đầu tiên tìm thấy
        return parseStringify(existingUsers.users[0]);
      }
    }

    // Nếu có lỗi khác hoặc không tìm thấy user đã tồn tại
    console.error("An error occurred while creating a new user:", error);
    return null; // Luôn trả về null nếu có lỗi
  }
};

//
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};
//
// export const getPatient = async (userId: string) => {
//   try {
//     const patients = await databases.listDocuments(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       [Query.equal("userId", [userId])]
//       // [Query.orderDesc("$createdAt")]
//     );

//     return parseStringify(patients.documents[0]);
//   } catch (error) {
//     console.error(
//       "An error occurred while retrieving the user details:",
//       error
//     );
//   }
// };
//cmt
// export const getPatient = async (patientId: string) => {
//   // Thêm một kiểm tra đầu vào để đảm bảo patientId hợp lệ
//   if (!patientId) {
//     console.error("getPatient called with no patientId.");
//     return null;
//   }

//   try {
//     const patient = await databases.getDocument(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       patientId
//     );

// export const getPatient = async (patientId: string) => {
//   // Thêm một kiểm tra đầu vào để đảm bảo patientId hợp lệ
//   if (!patientId) {
//     console.error("getPatient called with no patientId.");
//     return null;
//   }

//   try {
//     const patient = await databases.getDocument(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       patientId
//     );

//     // Nếu getDocument thành công, nó sẽ trả về một object.
//     // Nếu không tìm thấy, nó sẽ ném ra một lỗi và đi vào khối catch.
//     return parseStringify(patient);
//   } catch (error) {
//     // Bắt tất cả các lỗi, bao gồm cả lỗi "document not found"
//     console.error(`Failed to retrieve patient with ID ${patientId}:`, error);

//     return null;
//   }
// };
// cmt

export const getPatient = async (patientIdOrUserId: string) => {
  try {
    // Ưu tiên tìm bằng document ID (cách này nhanh nhất)
    try {
      const patient = await databases.getDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        patientIdOrUserId
      );
      return parseStringify(patient);
    } catch (error) {
      // Nếu không tìm thấy bằng document ID, thử tìm bằng user ID
      console.log(
        `Could not find patient by document ID, trying by user ID: ${patientIdOrUserId}`
      );
      console.log(
        `Could not find patient by document ID, trying by user ID: ${patientIdOrUserId}`
      );
      const patients = await databases.listDocuments(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        [Query.equal("userId", [patientIdOrUserId])]
      );

      if (patients.documents.length > 0) {
        return parseStringify(patients.documents[0]);
      } else {
        // Nếu không tìm thấy bằng cả hai cách, trả về null
        return null;
      }
    }
  } catch (error) {
    console.error(
      `An error occurred while retrieving patient with ID/UserID ${patientIdOrUserId}:`,
      error
    );
    return null;
  }
};

//
export const registerPatient = async ({
  identificationDocument,
  // emergencyContactName,
  // emergencyContactNumber,
  // primaryPhysician,
  // insuranceProvider,
  // insurancePolicyNumber,
  // allergies,
  // currentMedication,
  // familyMedicalHistory,
  // pastMedicalHistory,
  // identificationType,
  // identificationNumber,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBlob(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};
//

export const getPatients = async () => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")] // Sắp xếp theo bệnh nhân mới nhất
      // [Query.orderAsc("name")] // Sắp xếp theo tên bệnh nhân (A-Z)
    );

    return parseStringify(patients.documents);
  } catch (error) {
    console.error("An error occurred while retrieving patients:", error);
    return [];
  }
};

// =========================================================
// export const getPatientByUserId = async (userId: string) => {
//   try {
//     const patients = await databases.listDocuments(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       [Query.equal("userId", [userId])]
//     );

//     // listDocuments trả về một mảng, chúng ta lấy phần tử đầu tiên
//     return parseStringify(patients.documents[0]);
//   } catch (error) {
//     console.error(
//       "An error occurred while retrieving the patient by user ID:",
//       error
//     );
//     return null;
//   }
// };
