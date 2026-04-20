"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  id: string;
  email: string | null;
  name: string | null;
  statement: string | null;
  neighborhood: string | null;
  zipcode: string | null;
  tags: string | null;
};

type Tool = {
  id: number;
  name: string | null;
  imageLink: string | null;
  tags: string | null;
  replacementCost: number | null;
  owner: string | null;
  isBorrowed: boolean | null;
  ["manual/instructions"]: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfilePage() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setErrorMessage("You must be logged in to view your profile.");
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("User")
        .select("id, email, name, statement, neighborhood, zipcode, tags")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoading(false);
        return;
      }

      const { data: toolsData, error: toolsError } = await supabase
        .from("Tools")
        .select(
          'id, name, imageLink, tags, replacementCost, owner, isBorrowed, "manual/instructions"'
        )
        .eq("owner", user.id)
        .order("created_at", { ascending: false });

      if (toolsError) {
        setErrorMessage(toolsError.message);
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setTools(toolsData ?? []);
      setLoading(false);
    }

    loadProfilePage();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">{errorMessage}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <section className="rounded border p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {profile?.name || "Your Profile"}
            </h1>
            <p className="text-sm text-gray-white">
              {profile?.email || "No email available"}
            </p>
          </div>

          <Link href="/tools/new" className="rounded border px-4 py-2 pink-btn">
            Add Tool
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">Bio</p>
            <p className="text-white">
              {profile?.statement || "No bio added yet."}
            </p>
          </div>

          <div>
            <p className="font-medium">Neighborhood</p>
            <p className="text-white">
              {profile?.neighborhood || "Not provided"}
            </p>
          </div>

          <div>
            <p className="font-medium">ZIP Code</p>
            <p className="text-white">{profile?.zipcode || "Not provided"}</p>
          </div>

          <div>
            <p className="font-medium">Tags</p>
            <p className="text-white">{profile?.tags || "No tags added"}</p>
          </div>
        </div>
      </section>

      <section className="rounded border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Tools</h2>
          <p className="text-sm text-gray-white">
            {tools.length} {tools.length === 1 ? "tool" : "tools"}
          </p>
        </div>

        {tools.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-white">
              You have not added any tools yet.
            </p>
            <Link
              href="/tools/new"
              className="inline-block rounded border px-4 py-2 btn-secondary"
            >
              Add your first tool
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <div key={tool.id} className="rounded border p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold">
                    {tool.name || "Unnamed tool"}
                  </h3>
                  <p className="text-sm text-gray-white">
                    {tool.isBorrowed ? "Currently borrowed" : "Available"}
                  </p>
                </div>

                {tool.imageLink ? (
                  <img
                    src={tool.imageLink}
                    alt={tool.name || "Tool image"}
                    className="mb-3 h-40 w-full rounded border object-cover"
                  />
                ) : null}

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium">Tags</p>
                    <p className="text-white">{tool.tags || "No tags"}</p>
                  </div>

                  <div>
                    <p className="font-medium">Instructions</p>
                    <p className="text-white">
                      {tool["manual/instructions"] ||
                        "No instructions provided."}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Replacement Cost</p>
                    <p className="text-white">
                      {tool.replacementCost != null
                        ? `$${tool.replacementCost}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/tools/${tool.id}`}
                    className="inline-block rounded border px-3 py-2 text-sm btn-secondary"
                  >
                    View Tool
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
