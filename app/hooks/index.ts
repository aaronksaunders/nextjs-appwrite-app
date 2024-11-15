import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "../services/appwrite";

export const useCheckLoggedInUser = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLoggedInUser()
      .then((user) => {
        if (user) {
          router.replace("/dashboard");
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching logged-in user:", err);
        setError("Failed to fetch user data.");
        setIsLoading(false);
      });
  }, [router]);

  return { isLoading, error };
};
