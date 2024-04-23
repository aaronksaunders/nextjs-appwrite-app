import { useState } from "react";
import { getLoggedInUser } from "./services/appwrite";
import { redirect } from "next/navigation";

export default async function Home() {

  const user = await getLoggedInUser();
  console.log("[index page]=>",user);


  if (!user) redirect("/sign-in");
  redirect("/dashboard");


}
