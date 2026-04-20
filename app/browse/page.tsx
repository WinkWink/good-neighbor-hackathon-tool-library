"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ToolsMap = dynamic(() => import("../dashboard/UsersMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] min-h-[500px] items-center justify-center rounded-xl border">
      Loading map...
    </div>
  ),
});

type UserRow = {
  id: string;
  name: string | null;
  neighborhood: string | null;
  zipcode: string | null;
  statement: string | null;
};

type ToolRow = {
  id: number;
  name: string | null;
  tags: string | null;
  owner: string | null;
  isBorrowed: boolean | null;
  imageLink: string | null;
  replacementCost: number | null;
  ["manual/instructions"]: string | null;
};

type BrowseTool = {
  id: number;
  name: string;
  tags: string[];
  imageLink: string | null;
  replacementCost: number | null;
  instructions: string | null;
  ownerId: string;
  ownerName: string | null;
  neighborhood: string | null;
  zipcode: string | null;
  statement: string | null;
  lat: number;
  lng: number;
};

const ZIP_COORDS: Record<string, { lat: number; lng: number }> = {
  "19104": { lat: 39.9612, lng: -75.1994 },
  "19103": { lat: 39.9523, lng: -75.174 },
  "19102": { lat: 39.9528, lng: -75.1636 },
  "19143": { lat: 39.9489, lng: -75.2286 },
  "19146": { lat: 39.9396, lng: -75.179 },
  "19147": { lat: 39.9364, lng: -75.1548 },
  "19148": { lat: 39.9227, lng: -75.1592 },
  "19130": { lat: 39.9687, lng: -75.1739 },
  "19121": { lat: 39.9814, lng: -75.1652 },
  "19139": { lat: 39.9618, lng: -75.2327 },
};

export default function BrowsePage() {
  const [tools, setTools] = useState<BrowseTool[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBrowsePage() {
      setLoading(true);
      setErrorMessage("");

      const { data: usersData, error: usersError } = await supabase
        .from("User")
        .select("id, name, neighborhood, zipcode, statement");

      if (usersError) {
        setErrorMessage(usersError.message);
        setLoading(false);
        return;
      }

      const { data: toolsData, error: toolsError } = await supabase
        .from("Tools")
        .select(
          'id, name, tags, owner, isBorrowed, imageLink, replacementCost, "manual/instructions"'
        )
        .eq("isBorrowed", false);

      if (toolsError) {
        setErrorMessage(toolsError.message);
        setLoading(false);
        return;
      }

      const userMap = new Map<string, UserRow>();
      (usersData ?? []).forEach((user: UserRow) => {
        userMap.set(user.id, user);
      });

      const mergedTools: BrowseTool[] = (toolsData ?? [])
        .filter((tool: ToolRow) => tool.owner)
        .map((tool: ToolRow) => {
          const owner = userMap.get(tool.owner as string);
          const zipcode = owner?.zipcode ?? "";
          const coords = ZIP_COORDS[zipcode] ?? { lat: 39.9526, lng: -75.1652 };

          return {
            id: tool.id,
            name: tool.name || "Unnamed tool",
            tags: (tool.tags || "")
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            imageLink: tool.imageLink,
            replacementCost: tool.replacementCost,
            instructions: tool["manual/instructions"],
            ownerId: tool.owner as string,
            ownerName: owner?.name ?? "Neighbor",
            neighborhood: owner?.neighborhood ?? null,
            zipcode: owner?.zipcode ?? null,
            statement: owner?.statement ?? null,
            lat: coords.lat,
            lng: coords.lng,
          };
        });

      setTools(mergedTools);
      setLoading(false);
    }

    loadBrowsePage();
  }, []);

  const allTags = useMemo(() => {
    return Array.from(new Set(tools.flatMap((tool) => tool.tags))).sort();
  }, [tools]);

  const filteredTools = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesSearch =
        searchValue === "" ||
        tool.name.toLowerCase().includes(searchValue) ||
        (tool.ownerName || "").toLowerCase().includes(searchValue) ||
        (tool.neighborhood || "").toLowerCase().includes(searchValue) ||
        (tool.zipcode || "").toLowerCase().includes(searchValue) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchValue));

      const matchesTag =
        selectedTag === "all" || tool.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [tools, search, selectedTag]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p>Loading tools...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-red-600">{errorMessage}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Browse Community Tools</h1>
          <p className="text-sm text-gray-white">
            Explore tools shared by neighbors near you.
          </p>
        </div>
      </div>

      <section className="grid gap-4 rounded-xl border p-4 md:grid-cols-[2fr_1fr]">
        <input
          type="text"
          placeholder="Search tools, owners, neighborhoods, ZIP..."
          className="rounded border p-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="rounded border p-3"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="all">All tool types</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-xl border">
          <div className="border-b p-4">
            <h2 className="text-xl font-semibold">Available Tools</h2>
            <p className="text-sm text-gray-white">
              {filteredTools.length}{" "}
              {filteredTools.length === 1 ? "tool" : "tools"}
            </p>
          </div>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
            {filteredTools.length === 0 ? (
              <div className="rounded-lg border p-4">
                <p>No matching tools found.</p>
              </div>
            ) : (
              filteredTools.map((tool) => (
                <div key={tool.id} className="rounded-xl border p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">{tool.name}</h3>
                    <p className="text-sm text-gray-white">
                      Owned by {tool.ownerName || "Neighbor"}
                    </p>
                    <p className="text-sm text-gray-white">
                      {tool.neighborhood || "Unknown neighborhood"}
                      {tool.zipcode ? ` • ${tool.zipcode}` : ""}
                    </p>
                  </div>

                  {/* {tool.imageLink ? (
                    <img
                      src={tool.imageLink}
                      alt={tool.name}
                      className="mb-4 h-40 w-full rounded border object-cover"
                    />
                  ) : null} */}

                  <div className="mb-4">
                    <p className="mb-2 text-sm font-medium">Tags</p>
                    <div className="flex flex-wrap gap-2 ">
                      {tool.tags.length ? (
                        tool.tags.map((tag) => (
                          <span
                            key={`${tool.id}-${tag}`}
                            className="rounded-full border px-3 py-1 text-sm pink-btn"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No tags</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="mb-1 text-sm font-medium">Instructions</p>
                    <p className="text-sm text-white">
                      {tool.instructions || "No instructions provided."}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="mb-1 text-sm font-medium">Replacement Cost</p>
                    <p className="text-sm text-white">
                      {tool.replacementCost != null
                        ? `$${tool.replacementCost}`
                        : "Not provided"}
                    </p>
                  </div>

                  <Link
                    href="/login"
                    className="inline-block rounded border px-4 py-2 text-sm btn-secondary"
                  >
                    Log in to borrow
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-6">
          <ToolsMap tools={filteredTools} />
        </div>
      </section>
    </main>
  );
}
