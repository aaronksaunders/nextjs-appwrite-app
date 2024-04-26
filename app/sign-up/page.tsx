"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUpUser } from "../actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLoggedInUser } from "../services/appwrite";

/**
 * Renders the sign-up page component.
 *
 * @returns The sign-up page component.
 */
export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Check if the user is already logged in and redirect to the dashboard if they are
  useEffect(() => {
    getLoggedInUser().then((user) => {
      if (user) {
        router.replace("/dashboard");
        return;
      }
      loading && setLoading(false);
    });
  }, [loading, router]);

  // Handle the sign-up form submission
  const [state, action] = useFormState(signUpUser, undefined);

  // Get the form status
  const { pending } = useFormStatus();

  if (loading) return <p>Loading...</p>;

  /**
   * Renders a sign-up form component.
   *
   * @param {Object} props - The component props.
   * @param {Function} props.signUpUser - The function to handle user sign-up.
   * @returns {JSX.Element} The sign-up form component.
   */
  function SignUpForm({ signUpUser }: { signUpUser: any }) {

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
          aria-disabled={pending}
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
