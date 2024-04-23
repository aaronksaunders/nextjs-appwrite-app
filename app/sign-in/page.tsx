"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signInUser } from "../actions";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLoggedInUser } from "../services/appwrite";

export default function SignInPage() {
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

  const [state, action] = useFormState(signInUser, undefined);
  const { pending } = useFormStatus();

  if (loading) return <p>Loading...</p>;

  return (
    <main className="">
      <h2 className="text-2xl font-bold">App Entry Point</h2>
      <div className="flex flex-col items-center gap-4">
        <form action={action} className="flex flex-col pt-4 gap-4 border w-80">
          <h2>SIGN IN</h2>
          <div className="flex flex-row">
            <label htmlFor="email" className="w-20">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="flex-auto"
            />
          </div>
          <div className="flex flex-row">
            <label htmlFor="password" className="w-20">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="flex-auto"
            />
          </div>
          <button
            type="submit"
            className="mt-4 border border-black dark:border-white"
            disabled={pending}
          >
            {!pending ? "Sign In" : "Signing In..."}
          </button>
        </form>
        <Link href="/sign-up">Sign Up</Link>
        <>{state?.message}</>
      </div>
    </main>
  );
}
