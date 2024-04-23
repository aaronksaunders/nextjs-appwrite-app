"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUpUser } from "../actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLoggedInUser } from "../services/appwrite";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoggedInUser().then((user) => {
      if (user) {
        router.replace("/dashboard");
        return;
      }
      loading && setLoading(false);
    });
  }, [loading, router]);

  const [state, action] = useFormState(signUpUser, undefined);
  const { pending } = useFormStatus();

  if (loading) return <p>Loading...</p>;

  function SignUpForm({ signUpUser }: { signUpUser: any }) {
    const { pending } = useFormStatus();
    return (
      <form action={signUpUser} className="flex flex-col pt-4 gap-4">
        <div className="flex flex-row">
          <label htmlFor="name" className="w-20">
            Name
          </label>
          <input id="name" name="name" placeholder="Name" />
        </div>
        <div className="flex flex-row">
          <label htmlFor="email" className="w-20">
            Email
          </label>
          <input id="email" name="email" type="email" placeholder="Email" />
        </div>
        <div className="flex flex-row">
          <label htmlFor="password" className="w-20">
            Password
          </label>
          <input id="password" name="password" type="password" />
        </div>
        <button
          type="submit"
          className="mt-4 border border-black dark:border-white"
          disabled={pending}
        >
          {!pending ? "Sign Up" : "Signing Up..."}
        </button>
      </form>
    );
  }

  return (
    <main className="">
      <h2 className="text-2xl font-bold">App Entry Point</h2>
      <div className="flex flex-col items-center gap-4">
        <SignUpForm signUpUser={action} />
        <Link href="/sign-in">Sign In</Link>
      </div>
    </main>
  );
}
