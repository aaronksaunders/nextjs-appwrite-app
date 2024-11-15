"use server";
import {
  Client,
  Account,
  Databases,
  Query,
  Storage,
  ID,
  Permission,
  Role,
} from "node-appwrite";
import { cookies } from "next/headers";

/**
 * Creates an Appwrite client session using environment variables and cookies.
 * 
 * This function initializes a new Appwrite client with the endpoint and project ID
 * specified in the environment variables. It then retrieves the session cookie and
 * sets it on the client. If the session cookie is not found, an error is thrown.
 * 
 * @throws {Error} If no session cookie is found.
 * 
 * @returns {Object} An object containing instances of Appwrite services (Account, Databases, Storage).
 * 
 * @property {Account} account - An instance of the Appwrite Account service.
 * @property {Databases} database - An instance of the Appwrite Databases service.
 * @property {Storage} storage - An instance of the Appwrite Storage service.
 */
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
    get storage() {
      return new Storage(client);
    },
  };
}

/**
 * Creates an Appwrite client configured with admin privileges.
 * 
 * This function initializes a new Appwrite client using the endpoint, project ID,
 * and API key specified in the environment variables. It returns an object with
 * properties to access the Account and Databases services.
 * 
 * @returns An object containing the `account` and `database` properties, which
 * provide access to the Appwrite Account and Databases services respectively.
 * 
 * @throws Will throw an error if any of the required environment variables are not set.
 */
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

/**
 * Retrieves the currently logged-in user.
 *
 * This function attempts to create a session client and fetch the account details
 * of the currently logged-in user. If successful, it returns the user account information.
 * If an error occurs (e.g., no user is logged in), it returns null.
 *
 * @returns {Promise<any | null>} A promise that resolves to the user account information if logged in, or null if not.
 */
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

export type Comment = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  comment_text: string;
  author_id: string;
  author_name: string;
  tasks: string;
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

/**
 * Lists tasks associated with a specific project ID.
 *
 * @param {string} projectId - The ID of the project for which to list tasks.
 * @returns {Promise<Task[]>} A promise that resolves to an array of tasks associated with the specified project ID.
 * @throws Will throw an error if there is an issue listing the documents.
 */
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
export const updateTaskStatus = async (taskId: string, status: string) => {
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
};

/**
 * Adds a task to a project.
 *
 * @param projectId - The ID of the project.
 * @param task - The task object containing the name, description, and status.
 * @returns The created document.
 * @throws If there is an error creating the document.
 */
export const addTaskToProject = async (
  projectId: string,
  task: { name: string; description: string; status: string }
) => {
  const { database } = await createSessionClient();

  try {
    const document = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!,
      ID.unique(),
      {
        ...task,
        projects: projectId,
      }
    );
    return document;
  } catch (e) {
    console.error("[error updating document] ==>", e);
    throw e;
  }
};

/**
 * Retrieves a project document from the Appwrite database by its ID.
 *
 * @param {string} projectId - The ID of the project to retrieve.
 * @returns {Promise<Project>} - A promise that resolves to the project document.
 * @throws Will throw an error if the document retrieval fails.
 */
export const getProjectById = async (projectId: string) => {
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
};

/**
 * Retrieves a task document from the Appwrite database by its ID.
 *
 * @param {string} taskId - The ID of the task document to retrieve.
 * @returns {Promise<Task>} - A promise that resolves to the retrieved task document.
 * @throws {Error} - If an error occurs while retrieving the task document.
 */
export const getTaskById = async (taskId: string) => {
  const { database } = await createSessionClient();

  try {
    const document = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!,
      taskId
    );
    return document as Task;
  } catch (e) {
    console.error("[error getting document] ==>", e);
    throw e;
  }
};

/**
 * Adds a comment to a task.
 *
 * @param taskId - The ID of the task.
 * @param comment - The comment object containing the comment text, author ID, and author name.
 * @returns The created document.
 * @throws If there is an error creating the document.
 */
export const addCommentToTask = async (
  taskId: string,
  comment: { comment_text: string; author_id: string; author_name: string }
) => {
  const { database, account } = await createSessionClient();
  const currentUser = await account.get();

  const documentPermissions = [
    // Anyone can view this document
    Permission.read(Role.users()),
    // Current User  can update this document
    Permission.update(Role.user(currentUser?.$id)),
    // Current User can delete this document
    Permission.delete(Role.user(currentUser?.$id)),
    // Admins can update this document
    // Permission.update(Role.team("admin")),
    // Admins can delete this document
    // Permission.delete(Role.team("admin")),
  ];

  console.log("[permissions] ==>", documentPermissions);

  try {
    const document = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID!,
      ID.unique(),
      {
        ...comment,
        tasks: taskId,
      } as Comment,
      documentPermissions
    );
    return document as Comment;
  } catch (e) {
    console.error("[error updating document] ==>", e);
    throw e;
  }
};
