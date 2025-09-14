import { cookies } from "next/headers";
import * as sdk from "node-appwrite";

export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

const client = new sdk.Client();

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);

// Hàm này tạo ra một client với quyền admin, sử dụng API Key.
// Nó dùng cho các tác vụ server-side cần quyền cao nhất.
export const createAdminClient = async () => {
  const adminClient = new sdk.Client()
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);

  return {
    get account() {
      return new sdk.Account(adminClient);
    },
    get database() {
      return new sdk.Databases(adminClient);
    },
    get users() {
      return new sdk.Users(adminClient);
    },
  };
};

// Hàm này tạo ra một client với quyền của người dùng đã đăng nhập.
// Nó đọc session từ cookie và xác thực client bằng session đó.
export const createSessionClient = async () => {
  const sessionClient = new sdk.Client()
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!);

  const session = cookies().get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No session found");
  }

  sessionClient.setSession(session.value);

  return {
    get account() {
      return new sdk.Account(sessionClient);
    },
  };
};
