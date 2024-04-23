import UserInformation from "../components/UserInformation";
import { signOutUser } from "../actions";
import { getLoggedInUser } from "../services/appwrite";
import { redirect } from "next/navigation";

const DashboardPage = async () => {

  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  return (
    <main className="">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p>Welcome to the dashboard</p>
      <UserInformation />
      <form action={signOutUser}>
        <button>LOGOUT</button>
      </form>
    </main>
  );
};

export default DashboardPage;
