"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const tagOptions = ["Beginner", "Novice", "Intermediate", "Expert"];

export default function OnboardingPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [statement, setStatement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log("AUTH USER:", user);

      if (error) {
        setErrorMessage(error.message);
        setLoadingUser(false);
        return;
      }

      if (!user) {
        setErrorMessage("No authenticated user found.");
        setLoadingUser(false);
        return;
      }

      // Skip onboarding for anonymous hackathon users
      if (user.is_anonymous) {
        router.replace("/dashboard");
        return;
      }

      const { data: existingProfile, error: profileError } = await supabase
        .from("User")
        .select("id, email, name, statement, neighborhood, zipcode, tags")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoadingUser(false);
        return;
      }

      if (existingProfile) {
        router.replace("/dashboard");
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");
      setName((user.user_metadata?.name as string) ?? "");
      setLoadingUser(false);
    }

    loadUser();
  }, [router]);

  function handleTagToggle(tag: string) {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userId) {
      setErrorMessage("No authenticated user found.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const { error } = await supabase.from("User").upsert({
      id: userId,
      email,
      name,
      statement,
      neighborhood,
      zipcode,
      tags: tags.join(", "),
    });

    setSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace("/dashboard");
  }

  if (loadingUser) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <p>Loading your profile setup...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-sm text-gray-white">
          Add a few details so neighbors can find and trust you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded border p-6">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded border p-2"
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
            className="w-full rounded border bg-gray-100 p-2 text-black"
            value={email}
            readOnly
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="statement" className="block text-sm font-medium">
            Bio / Statement
          </label>
          <textarea
            id="statement"
            rows={4}
            className="w-full rounded border p-2"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="Tell neighbors a little about yourself."
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="neighborhood" className="block text-sm font-medium">
            Neighborhood
          </label>
          <input
            id="neighborhood"
            type="text"
            className="w-full rounded border p-2"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="West Philly"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="zipcode" className="block text-sm font-medium">
            ZIP Code
          </label>
          <input
            id="zipcode"
            type="text"
            className="w-full rounded border p-2"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="19143"
            required
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Experience Level</p>
          <div className="flex flex-wrap gap-3">
            {tagOptions.map((tag) => (
              <label key={tag} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded border px-4 py-2"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>

        {errorMessage ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : null}
      </form>
    </main>
  );
}
