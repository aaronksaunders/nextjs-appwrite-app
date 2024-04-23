import { redirect } from "next/navigation";
import { getLoggedInUser, listProjectDocuments } from "../services/appwrite";
import Link from "next/link";

const HomePage = async () => {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  // get projects from database
  const projects = await listProjectDocuments();

  return (
    <main >
      <h2 className="text-2xl font-bold">Projects Page</h2>
      {projects.map((project) => (
        <Link href={`/tasks/${project.$id}`} key={project.$id}>
          <div
            key={project.$id}
            className="bg-gray-100 p-4 my-4 cursor-pointer"
          >
            <h3 className="text-lg font-bold capitalize">{project.name}</h3>
            <p>{project.description}</p>
          </div>
        </Link>
      ))}
    </main>
  );
};

export default HomePage;
