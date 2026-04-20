"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleContinue() {
    setLoading(true);
    setErrorMessage("");

    try {
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Good Neighbor Tool Library</h1>
        <p className="text-sm text-gray-500">
          Enter the demo to explore the tool-sharing experience.
        </p>
      </div>

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full rounded border px-4 py-2"
      >
        {loading ? "Entering..." : "Enter Demo"}
      </button>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </main>
  );
}
