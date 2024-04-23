import { redirect } from "next/navigation";
import { getLoggedInUser } from "../services/appwrite";
import { UploadFile } from "./components/UploadFile";
import { listFiles, previewFile } from "../actions";

/**
 * The ImagesPage component displays a list of images and allows users to upload new images.
 * @returns {JSX.Element} - The ImagesPage component.
 */
const ImagesPage = async () => {
  // Get the logged-in user, if not redirect to sign-in page
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  // Get the list of files and preview them
  const documents = await listFiles();

  // Get the preview of the files in base64 format for display
  let files: string[] = [];
  if (documents && documents.files && documents.files.length > 0) {
    files = await Promise.all(
      documents.files.map(async (document: any) => {
        // Get the file preview as an ArrayBuffer
        const arrayBuffer = await previewFile(document.$id);

        // Convert ArrayBuffer to base64
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        // Return the base64 string
        return `data:image/jpeg;base64,${base64}`;
      })
    );
  }

  return (
    <main className="flex flex-wrap justify-center flex-col border  w-1/2">
      <h2 className="text-2xl font-bold">Images Page</h2>
      <UploadFile />
      <h2 className="text-2xl font-bold">Images</h2>
      <div className="flex flex-wrap">
        {documents?.files?.map(async (document: any, index: number) => {
          return (
            <div key={document.$id} className="flex flex-col">
              <div className="flex flex-1 gap-2 m-4">
                <img src={files[index]} width={200} />
                <div>{document.name}</div>
                <div>{document.mimeType}</div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ImagesPage;
