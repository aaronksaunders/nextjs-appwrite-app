import { redirect } from "next/navigation";
import { useCheckLoggedInUser } from "./hooks";

export default async function Home() {
  const { isLoading, error: loggedInStatusErr } = useCheckLoggedInUser();
  if (isLoading) return <p>Loading...</p>;
  if (loggedInStatusErr) return <p>Error: {loggedInStatusErr}</p>;
  redirect("/dashboard");
}
