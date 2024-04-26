import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addTaskToProject,
  getLoggedInUser,
  getProjectById,
} from "../../../services/appwrite";
import SelectBox from "@/app/components/StatusSelect";
import Link from "next/link";

const TaskPage = async ({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  // get projects from database
  const project = await getProjectById(params.projectId);

  /**
   * Adds a task to a project.
   *
   * @param {FormData} formData - The form data containing the task details.
   * @returns {Promise<void>} - A promise that resolves when the task is added successfully.
   */
  const addTask = async (formData: FormData): Promise<void> => {
    "use server";
    const rawFormData = {
      projectId: formData.get("projectId") || undefined,
      name: formData.get("name") || undefined,
      description: formData.get("description") || undefined,
      status: formData.get("status") || undefined,
    };

    console.log("rawFormData", rawFormData);
    const addTaskResponse = await addTaskToProject(
      rawFormData.projectId as string,
      {
        status: rawFormData.status as string,
        name: rawFormData.name as string,
        description: rawFormData.description as string,
      }
    );
    console.log("[add task ] ==>", addTaskResponse);

    revalidatePath(`/tasks/${rawFormData.projectId}`);
  };

  return (
    <main className="flex flex-wrap justify-center flex-col border  w-1/2">
      <h2 className="text-2xl font-bold">Project Add Task Page</h2>
      <p>
        Welcome to the project task page{" "}
        <span className="font-bold capitalize">{project?.name}</span>
      </p>
      <form action={addTask} className="mx-4 mt-8 gap-4 flex flex-col">
        <input type="hidden" name="projectId" value={params.projectId} />
        <div className="flex flex-col">
          <label htmlFor="name" className="w-20 font-bold mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Name"
            className="border rounded-md p-2  ring-0 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="w-20 font-bold mb-1">
            Description
          </label>
          <textarea
            className="border rounded-md p-2 ring-0 outline-none"
            id="description"
            name="description"
            placeholder="Description"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="status" className="w-20 font-bold mb-1 ">
            Status
          </label>
          <SelectBox
            id="status"
            name="status"
            className="border rounded-md p-2"
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="border-green-600 border px-4 py-1 rounded text-sm"
          >
            Add Task
          </button>

          <Link
            href={`/tasks/${params.projectId}`}
          >
            <button
              type="button"
              className="border-red-600 border px-4 py-1 rounded text-sm"
            >
              CANCEL
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default TaskPage;
