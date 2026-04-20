"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [strength, setStrength] = useState("");

  function checkPasswordStrength(pw: string) {
    if (pw.length < 6) return "Weak";
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/) && pw.length >= 8)
      return "Strong";
    return "Medium";
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setStrength(checkPasswordStrength(value));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/onboarding");
  }

  return (
    <main className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-sm text-gray-white">
          Create your account to start borrowing and lending tools.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded border p-4">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded border p-2"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded border p-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded border p-2"
            placeholder="Create a password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />

          {password ? (
            <p
              className={`text-sm ${
                strength === "Strong"
                  ? "text-green-600"
                  : strength === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Password strength: {strength}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded border px-4 py-2"
        >
          {loading ? "Creating account..." : "Continue"}
        </button>

        {errorMessage ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : null}
      </form>
    </main>
  );
}
