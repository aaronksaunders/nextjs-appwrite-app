"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUpUser } from "../actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getLoggedInUser } from "../services/appwrite";
import { useCheckLoggedInUser } from "../hooks";

/**
 * SignUpPage component handles the sign-up process for users.
 * It checks if a user is already logged in and redirects to the dashboard if true.
 * Otherwise, it displays a sign-up form.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);

  const { isLoading, error: loggedInStatusErr } = useCheckLoggedInUser();
  const { pending } = useFormStatus();

  useEffect(() => {
    setError(loggedInStatusErr);
  }, [loggedInStatusErr]);

  /**
   * Handles the sign-up form submission.
   * Prevents the default form submission behavior, extracts form data,
   * and calls the sign-up function.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    try {
      const response = await signUpUser(name, email, password);
      if (response.error) {
        setError(response.message);
        return;
      }
      // Handle successful sign-up
    } catch (err) {
      console.error("Error signing up:", err);
      setError("Failed to sign up.");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="">
      <h2 className="text-2xl font-bold">App Entry Point</h2>
      <div className="flex flex-col items-center gap-4">
        {error && <p className="text-red-500">{error}</p>}
        <form
          className="flex flex-col pt-4 gap-4 border-2 p-4 w-96 border-gray-300 rounded-lg shadow-md mt-4"
          onSubmit={handleSignUp}
        >
          <h2>SIGN UP</h2>
          <div className="flex flex-row items-center">
            <label htmlFor="name" className="w-20">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              className="flex-auto px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-row items-center">
            <label htmlFor="email" className="w-20">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="flex-auto px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-row items-center">
            <label htmlFor="password" className="w-20">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="flex-auto px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-col gap-4 items-center">
            <button
              type="submit"
              className="mt-4 border border-gray-400 py-2 rounded-md w-80 font-bold"
              disabled={pending}
            >
              {!pending ? "Sign Up" : "Signing Up..."}
            </button>
            <Link
              href="/sign-in"
              className="border border-gray-400 py-2 rounded-md w-80 font-bold text-center"
            >
              Back To Sign In Page
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
