"use server";
import { getLoggedInUser } from "../services/appwrite";

const UserInformation = async () => {

    const user = await getLoggedInUser();
    if (!user) return null;

  return (
    <div className="bg-gray-100 p-4">
      <h2 className="text-lg font-bold">User Information</h2>
      <p>Username: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserInformation;