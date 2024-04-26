'use client' // Error components must be Client Components
import { useEffect, useState } from "react";

const AddTaskError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const [zodError, setZodError] = useState<Zod.ZodError | null>(null);
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error("[Add Task Error]==>", JSON.stringify(error));

    setZodError((error as any)?.cause as Zod.ZodError);
    console.log("[add comment cause] ==>", zodError?.errors);

  }, [error, zodError?.errors]);
  return (
    <div>
      <h1>Task not added</h1>
      <p>There was an error adding the task</p>
      {/* display the zodErrors */}
      {/* <ErrorComponent zodErrors={zodError?.errors} /> */}
      <button onClick={reset}>Try again</button>
    </div>
  );
};

export default AddTaskError;

