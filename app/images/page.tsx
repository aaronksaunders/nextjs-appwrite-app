import { redirect } from "next/navigation";
import { getLoggedInUser, listProjectDocuments } from "../services/appwrite";
import { PageContent } from "./components/PageContent";

const ImagesPage = async () => {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  return (
    <main className="flex flex-wrap justify-center flex-col border  w-1/2">
      <h2 className="text-2xl font-bold">Images Page</h2>
      <PageContent />
    </main>
  );
};

export default ImagesPage;


