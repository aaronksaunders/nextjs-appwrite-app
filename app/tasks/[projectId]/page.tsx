import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getLoggedInUser,
  getProjectById,
  listProjectDocuments,
  listProjectTasksById,
  updateTaskStatus,
} from "../../services/appwrite";
import Link from "next/link";
import SelectBox from "@/app/components/StatusSelect";
import { format } from "date-fns";

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
  const tasks = await listProjectTasksById(params.projectId);
  const project = await getProjectById(params.projectId);

  const updateStatus = async (formData: FormData) => {
    "use server";
    const rawFormData = {
      projectId: formData.get("projectId") || undefined,
      taskId: formData.get("taskId") || undefined,
      status: formData.get("status") || undefined,
    };

    console.log("rawFormData", rawFormData);
    const updateResponse = await updateTaskStatus(
      rawFormData.taskId as string,
      rawFormData.status as string
    );
    console.log("[updated task status] ==>", updateResponse);

    revalidatePath(`/tasks/${rawFormData.projectId}`);
  };

  return (
    <main className="flex flex-wrap justify-center flex-col border  w-1/2">
      <h2 className="text-2xl font-bold">Project Task Page</h2>
      <p>
        Welcome to the project task page{" "}
        <span className="font-bold capitalize">{project?.name}</span>
      </p>
      <div className="mt-4">
        <Link
          href={`/tasks/${params.projectId}/add`}
          className="border border-green-600 px-4 py-1 rounded text-sm"
        >
          Add Task
        </Link>
      </div>
      {tasks.map((task) => (
        <div className="bg-gray-100 p-4 my-4" key={task.$id}>
          <form action={updateStatus}>
            <input type="hidden" name="projectId" value={params.projectId} />
            <input type="hidden" name="taskId" value={task.$id} />
            <h3 className="text-lg font-bold capitalize">{task.name}</h3>

            <div className="my-2">{task.description}</div>
            <div className="my-2">
              Status:
              <SelectBox value={task.status} />
            </div>
            <div className="mt-4 flex place-content-between">
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="border-green-600 border px-4 py-1 rounded text-sm"
                >
                  Update
                </button>
                <Link href={`/tasks/${params.projectId}/comments/${task.$id}`}>
                  <button
                    type="button"
                    className="border-green-600 border px-4 py-1 rounded text-sm"
                  >
                    Comments
                  </button>
                </Link>
              </div>
              <div className="text-sm opacity-50 py-1">
                {format(task.$updatedAt, "Pp")}
              </div>
            </div>
          </form>
        </div>
      ))}
    </main>
  );
};

export default TaskPage;
