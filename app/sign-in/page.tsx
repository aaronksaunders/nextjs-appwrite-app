"use client";

import { useFormStatus } from "react-dom";
import { signInUser } from "../actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCheckLoggedInUser } from "../hooks";

/**
 * SignInPage component handles the sign-in process for users.
 * It checks if a user is already logged in and redirects to the dashboard if true.
 * Otherwise, it displays a sign-in form.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);

  const { isLoading, error: loggedInStatusErr } = useCheckLoggedInUser();
  const { pending } = useFormStatus();

  useEffect(() => {
    setError(loggedInStatusErr);
  }, [loggedInStatusErr]);

  /**
   * Handles the sign-in form submission.
   * Prevents the default form submission behavior, extracts form data,
   * and calls the sign-in function.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await signInUser(email, password);
      if (response.error) {
        setError(response.message);
        return;
      }
      // Handle successful sign-in
    } catch (err) {
      console.error("Error signing in:", err);
      setError("Failed to sign in.");
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
          onSubmit={handleSignIn}
        >
          <h2>SIGN IN</h2>
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
              className="flex-auto  px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-col gap-4 items-center">
            <button
              type="submit"
              className="mt-4 border border-gray-400 py-2 rounded-md w-80 font-bold"
              disabled={pending}
            >
              {!pending ? "Sign In" : "Signing In..."}
            </button>
            <Link
              href="/sign-up"
              className="border border-gray-400 py-2 rounded-md w-80 font-bold text-center"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
