"use server";
import { Client, Account, Databases, Query } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const session = cookies().get(process.env.NEXT_APPWRITE_COOKIE_NAME!);
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },

    get database() {
      return new Databases(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

//////////////////////////////////////////////////////////////////////////////////
// DATABASE
//////////////////////////////////////////////////////////////////////////////////

export type Project = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  name: string;
  description: string;
  tasks: Task[];
};

export type Task = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  name: string;
  description: string;
  [key: string]: any;
};

/**
 * Retrieves a list of documents from the database.
 * @returns {Promise<Models.Document[]>} A promise that resolves when the list of documents is retrieved.
 */
export async function listProjectDocuments(): Promise<Project[]> {
  try {
    const { database } = await createSessionClient();
    const documents = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!
    );
    return documents.documents as Project[];
  } catch (e) {
    console.error("[error listing documents] ==>", e);
    throw e;
  }
}

export async function listProjectTasksById(projectId: string): Promise<Task[]> {
  try {
    const { database } = await createSessionClient();
    const documents = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!,
      [Query.equal("projects", projectId)]
    );
    return documents.documents as Project[];
  } catch (e) {
    console.error("[error listing documents] ==>", e);
    throw e;
  }
}


/**
 * Updates the status of a task in the Appwrite database.
 * 
 * @param {string} taskId - The ID of the task to update.
 * @param {string} status - The new status of the task.
 * @returns {Promise<any>} - A promise that resolves to the updated document.
 * @throws {Error} - If an error occurs while updating the document.
 */
export const updateTaskStatus = async (taskId:string, status:string) => {
  const { database } = await createSessionClient();

  try {
    const document = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!,
      taskId,
      {
        status,
      }
    );
    return document;
  } catch (e) {
    console.error("[error updating document] ==>", e);
    throw e;
  }
}

export const getProjectById = async (projectId:string) => {
  const { database } = await createSessionClient();

  try {
    const document = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!,
      projectId
    );
    return document as Project;
  } catch (e) {
    console.error("[error getting document] ==>", e);
    throw e;
  }
}