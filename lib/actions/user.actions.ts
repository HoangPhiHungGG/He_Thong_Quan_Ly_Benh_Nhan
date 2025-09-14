// lib/actions/user.actions.ts
"use server";

import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { createAdminClient, createSessionClient } from "../appwrite.config";
interface LoginUserParams {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginUserParams) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(session);
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    return null;
  }
};
