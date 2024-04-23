import UserInformation from "../components/UserInformation";
import { signOutUser } from "../actions";
import { getLoggedInUser } from "../services/appwrite";
import { redirect } from "next/navigation";

const DashboardPage = async () => {

  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  return (
    <main className="flex flex-wrap justify-center flex-col border  w-1/2">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p>Welcome to the dashboard</p>
      <UserInformation />
    </main>
  );
};

export default DashboardPage;
