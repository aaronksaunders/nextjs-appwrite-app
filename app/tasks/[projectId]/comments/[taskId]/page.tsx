import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addTaskToProject,
  Comment,
  getLoggedInUser,
  getTaskById,
  Task,
} from "@/app/services/appwrite";
import Link from "next/link";
import { format } from "date-fns";

const TaskPage = async ({
  params,
  searchParams,
}: {
  params: { taskId: string; projectId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  // get projects from database
  const task = (await getTaskById(params.taskId)) as Task;

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
    <main className="flex flex-wrap justify-center flex-col border border-black  w-1/2">
      <h2 className="text-2xl font-bold">Task Detail Page</h2>

      <h3 className="text-lg font-bold capitalize">{task.name}</h3>
      <div className="my-1">{task.description}</div>

      <h3 className="text-lg font-bold capitalize">Comments</h3>

      <div className="">
        <div>
          {task.comments.map((comment:Comment) => (
            <div key={comment.$id} className="bg-gray-100 p-4 my-4">
              <h3 className="text-lg font-bold capitalize">{comment.author_name}</h3>
              <div className="my-2">{comment.comment_text}</div>
              <div className="my-2">{format(comment.$updatedAt,'Pp')}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/tasks/${params.projectId}/comments/${task.$id}/add`}
          className="border border-green-600 px-4 py-1 rounded text-sm"
        >
          Add Comment
        </Link>
      </div>
      <div className="mt-4">
        <Link
          href={`/tasks/${params.projectId}`}
          className="border border-green-600 px-4 py-1 rounded text-sm"
        >
          CANCEL
        </Link>
      </div>
    </main>
  );
};

export default TaskPage;
