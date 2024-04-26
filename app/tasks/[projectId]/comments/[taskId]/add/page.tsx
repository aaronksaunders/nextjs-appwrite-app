import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addCommentToTask,
  getLoggedInUser,
  getProjectById,
  getTaskById,
} from "@/app/services/appwrite";
import Link from "next/link";
// add zod to validate form data
import { z } from "zod";
import { error } from "console";

// Define the schema for the comment data used to validate the form data
const commentSchema = z.object({
  taskId: z.string(),
  comment_text: z.string().min(10).max(1000),
  author_id: z.string(),
  author_name: z.string(),
});


/**
 * Renders the page for adding a comment to a task.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters containing the task and project IDs.
 * @param {string} props.params.taskId - The ID of the task.
 * @param {string} props.params.projectId - The ID of the project.
 * @param {Object} props.searchParams - The search parameters.
 * @returns {JSX.Element} - The rendered component.
 */
const AddCommentToTaskPage = async ({
  params,
  searchParams,
}: {
  params: { taskId: string; projectId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  // get projects from database
  const task = await getTaskById(params.taskId);
  const project = await getProjectById(params.projectId);

  const z_error: any = { errors: [] };

  /**
   * Adds a task to a project.
   *
   * @param {FormData} formData - The form data containing the task details.
   * @returns {Promise<void>} - A promise that resolves when the task is added successfully.
   */
  const addTaskComment = async (formData: FormData): Promise<void> => {
    "use server";

    const validateComment = (formData: FormData) => {
      const rawFormData = Object.fromEntries(formData.entries());

      const result = commentSchema.safeParse(rawFormData);

      if (!result.success) {
        throw new Error("Invalid comment data", {
          cause: result.error,
        });
      }

      return result.data;
    };

    try {
      const validatedData = validateComment(formData);
      const addTaskCommentResponse = await addCommentToTask(
        validatedData.taskId,
        {
          comment_text: validatedData.comment_text,
          author_id: validatedData.author_id,
          author_name: validatedData.author_name,
        }
      );
      console.log("[add task response ] ==>", addTaskCommentResponse);
    } catch (e) {
      console.error("[error adding comment] ==>", e);
      throw e;
    }
  };

  return (
    <main className="flex flex-wrap justify-center flex-col border  w-1/2">
      <h2 className="text-2xl font-bold">Task Add Comment Page</h2>
      <div className="my-1">{task.name}</div>

      <form
        action={async (fd) => {
          "use server";
          try {
            await addTaskComment(fd);
          } catch (e) {
            console.error("[add comment error] ==>", (e as any)?.message);

            const zodError = (e as any)?.cause as Zod.ZodError;

            zodError?.errors.map((error: any, index: number) => {
              // Replace 'any' with the actual type of your error
              console.log(error.message);
              z_error.errors = [ { message: "HELLLOOOOO"}]
              
            });

            // z_error = zodError;
            return;
          }

          redirect(`/tasks/${project.$id}/comments/${task.$id}`);
        }}
        className="mx-4 mt-8 gap-4 flex flex-col"
      >
        <input type="hidden" name="taskId" value={params.taskId} />
        <input type="hidden" name="author_id" value={user.$id} />
        <input type="hidden" name="author_name" value={user.name} />
        <div className="flex flex-col">
          <label htmlFor="name" className="w-40 font-bold mb-1">
            Comment Text
          </label>

          <textarea
            className="border rounded-md p-2 ring-0 outline-none"
            id="comment_text"
            name="comment_text"
            placeholder="Comment Text"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="border-green-600 border px-4 py-1 rounded text-sm"
          >
            Add Comment
          </button>

          <Link href={`/tasks/${params.projectId}/comments/${params.taskId}`}>
            <button
              type="button"
              className="border-red-600 border px-4 py-1 rounded text-sm"
            >
              CANCEL
            </button>
          </Link>
        </div>
      </form>
      <pre>{JSON.stringify(z_error.errors)}</pre>
    </main>
  );
};

export default AddCommentToTaskPage;
