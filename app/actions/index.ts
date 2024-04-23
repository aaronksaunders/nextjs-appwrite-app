"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../services/appwrite";


/**
 * Logs in a user using the provided form data.
 * @param formData - The form data containing the user's email and password.
 * @returns {Promise<void>} - A promise that resolves when the user is logged in successfully.
 */
export async function signInUser(state: any, formData: FormData): Promise<any> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(
      email as string,
      password as string
    );

    cookies().set(process.env.NEXT_APPWRITE_COOKIE_NAME!, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  } catch (error) {
    // console.error("[loginUser]", error);
    return {
      message: (error as any)?.message,
    };
  }

  return redirect("/dashboard");
}

export async function signUpUser(state: any, formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    const { account } = await createAdminClient();

    await account.create(
      ID.unique(),
      email as string,
      password as string,
      name as string
    );
    const session = await account.createEmailPasswordSession(
      email as string,
      password as string
    );

    cookies().set(process.env.NEXT_APPWRITE_COOKIE_NAME!, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    redirect("/dashboard");
  } catch (error) {
    console.error("[signUpUser]", error);
    return Promise.reject(error);
  }
}

export async function signOutUser() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
    cookies().set(process.env.NEXT_APPWRITE_COOKIE_NAME!, "", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(0),
    });
    redirect("/sign-in");
  } catch (error) {
    console.error("[logout]", error);
  }
}
