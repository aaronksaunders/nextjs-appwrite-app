"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../services/appwrite";
import { Readable } from "node:stream";
import { InputFile } from "node-appwrite/file";

/**
 * Logs in a user using the provided form data.
 * @param formData - The form data containing the user's email and password.
 * @returns {Promise<void>} - A promise that resolves when the user is logged in successfully.
 */
export async function signInUser(
  email: string,
  password: string
): Promise<any> {
  try {
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

    console.log("Logged in successfully", session);
  } catch (error) {
    console.error("[loginUser]", error);
    return {
      error: true,
      message: (error as any)?.message,
    };
  }

  return redirect("/dashboard");
}

/**
 * Signs up a user with the provided form data.
 *
 * @param state - The state object.
 * @param formData - The form data containing user information.
 * @returns A promise that resolves when the user is signed up successfully, or rejects with an error.
 */
export async function signUpUser(name: string, email: string, password: string) {
  try {

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
    return {
      error: true,
      message: (error as any)?.message,
    }
  }
}

/**
 * Signs out the current user by deleting the session and clearing the authentication cookie.
 */
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

////////////////////////////////////////////////////////////////////////////////
// STORAGE
////////////////////////////////////////////////////////////////////////////////
/**
 * Uploads a file to the Appwrite storage.
 *
 * @param formData - The form data containing the file to upload.
 * @returns A Promise that resolves with the response from the server if the file is uploaded successfully, or rejects with an error if there's an issue with the upload.
 */
export async function uploadFile(formData: FormData) {
  try {
    const { storage } = await createSessionClient();
    const file = formData.get("uploadFile") as File;

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer]);

    const response = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      InputFile.fromBuffer(blob, file.name)
    );
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    return Promise.reject(error);
  }
}

export async function downloadFile(fileId: string) {
  try {
    const { storage } = await createSessionClient();
    const response = await storage.getFileDownload(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      fileId
    );
    return response;
  } catch (error) {
    console.error("Error downloading file:", error);
    return Promise.reject(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    const { storage } = await createSessionClient();
    const response = await storage.deleteFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      fileId
    );
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    return Promise.reject(error);
  }
}

export async function listFiles() {
  try {
    const { storage } = await createSessionClient();
    const response = await storage.listFiles(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!
    );
    return response;
  } catch (error) {
    console.error("Error listing files:", error);
    return Promise.reject(error);
  }
}

export async function getFile(fileId: string) {
  try {
    const { storage } = await createSessionClient();
    const response = await storage.getFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      fileId
    );
    return response;
  } catch (error) {
    console.error("Error getting file:", error);
    return Promise.reject(error);
  }
}

export async function updateFile(fileId: string, formData: FormData) {}

export async function previewFile(fileId: string) {
  try {
    const { storage } = await createSessionClient();
    const response = await storage.getFilePreview(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      fileId,
      200
    );
    return response;
  } catch (error) {
    console.error("Error previewing file:", error);
    return Promise.reject(error);
  }
}

////////////////////////////////////////////////////////////////////////////////
// DATABASE
////////////////////////////////////////////////////////////////////////////////
/**
 * Creates a new document in the Appwrite database.
 *
 * @param formData - The form data containing the document to create.
 * @returns A Promise that resolves with the response from the server if the document is created successfully, or rejects with an error if there's an issue with the creation.
 */
export async function createDocument(formData: FormData) {
  try {
    const { database } = await createSessionClient();
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const data = Object.fromEntries(formData.entries());
    const response = await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating document:", error);
    return Promise.reject(error);
  }
}
