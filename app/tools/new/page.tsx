"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewToolPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [tags, setTags] = useState("");
  const [replacementCost, setReplacementCost] = useState("");

  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setErrorMessage("You must be logged in to add a tool.");
        setLoadingUser(false);
        return;
      }

      if (user.is_anonymous) {
        setErrorMessage("Guest users cannot add tools. Please sign up first.");
        setLoadingUser(false);
        return;
      }

      const { data: existingProfile, error: profileError } = await supabase
        .from("User")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoadingUser(false);
        return;
      }

      if (!existingProfile) {
        const { error: insertProfileError } = await supabase
          .from("User")
          .insert({
            id: user.id,
            email: user.email ?? "",
            name: (user.user_metadata?.name as string) ?? "",
            statement: "",
            neighborhood: "",
            zipcode: "",
            tags: null,
          });

        if (insertProfileError) {
          setErrorMessage(insertProfileError.message);
          setLoadingUser(false);
          return;
        }
      }

      setUserId(user.id);
      setLoadingUser(false);
    }

    loadUser();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userId) {
      setErrorMessage("No authenticated user found.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const parsedReplacementCost =
      replacementCost.trim() === "" ? null : Number(replacementCost);

    const { error } = await supabase.from("Tools").insert({
      name,
      ["manual/instructions"]: instructions,
      imageLink,
      tags,
      replacementCost: parsedReplacementCost,
      owner: userId,
      isBorrowed: false,
    });

    setSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace("/profile");
  }

  if (loadingUser) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Add a Tool</h1>
        <p className="text-sm">
          Add a tool to your profile so neighbors can borrow it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded border p-6">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium">
            Tool Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cordless Drill"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="instructions" className="block text-sm font-medium">
            Instructions / Notes
          </label>
          <textarea
            id="instructions"
            rows={4}
            className="w-full rounded border p-2"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Battery charger is in the side pocket."
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="imageLink" className="block text-sm font-medium">
            Image Link
          </label>
          <input
            id="imageLink"
            type="text"
            className="w-full rounded border p-2"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="tags" className="block text-sm font-medium">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            className="w-full rounded border p-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="power tools, drill, home repair"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="replacementCost"
            className="block text-sm font-medium"
          >
            Replacement Cost
          </label>
          <input
            id="replacementCost"
            type="number"
            className="w-full rounded border p-2"
            value={replacementCost}
            onChange={(e) => setReplacementCost(e.target.value)}
            placeholder="80"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-secondary">
          {saving ? "Saving..." : "Add Tool"}
        </button>

        {errorMessage ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : null}
      </form>
    </main>
  );
}
