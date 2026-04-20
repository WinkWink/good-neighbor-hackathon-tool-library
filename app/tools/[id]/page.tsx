"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ToolRecord = {
  id: number;
  name: string | null;
  imageLink: string | null;
  tags: string | null;
  replacementCost: number | null;
  owner: string | null;
  isBorrowed: boolean | null;
  ["manual/instructions"]: string | null;
};

type UserRecord = {
  id: string;
  name: string | null;
  neighborhood: string | null;
  zipcode: string | null;
  statement: string | null;
};

export default function ToolPage() {
  const params = useParams();
  const toolId = params?.id;

  const [tool, setTool] = useState<ToolRecord | null>(null);
  const [owner, setOwner] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadTool() {
      if (!toolId || Array.isArray(toolId)) {
        setErrorMessage("Invalid tool id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      const numericToolId = Number(toolId);

      if (Number.isNaN(numericToolId)) {
        setErrorMessage("Invalid tool id.");
        setLoading(false);
        return;
      }

      const { data: toolData, error: toolError } = await supabase
        .from("Tools")
        .select(
          'id, name, imageLink, tags, replacementCost, owner, isBorrowed, "manual/instructions"'
        )
        .eq("id", numericToolId)
        .maybeSingle();

      if (toolError) {
        setErrorMessage(toolError.message);
        setLoading(false);
        return;
      }

      if (!toolData) {
        setErrorMessage("Tool not found.");
        setLoading(false);
        return;
      }

      setTool(toolData);

      if (toolData.owner) {
        const { data: ownerData, error: ownerError } = await supabase
          .from("User")
          .select("id, name, neighborhood, zipcode, statement")
          .eq("id", toolData.owner)
          .maybeSingle();

        if (ownerError) {
          setErrorMessage(ownerError.message);
          setLoading(false);
          return;
        }

        setOwner(ownerData);
      }

      setLoading(false);
    }

    loadTool();
  }, [toolId]);

  const tagList = (tool?.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p>Loading tool...</p>
      </main>
    );
  }

  if (errorMessage || !tool) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-red-600">{errorMessage || "Tool not found."}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <Link href="/dashboard" className="btn-secondary">
        Back to Dash
      </Link>

      <section className="card grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          {tool.imageLink ? (
            <div className="flex h-[420px] w-full items-center justify-center rounded-3xl bg-white p-8">
              <img
                src={tool.imageLink || "/branding/tool-img.png"}
                alt={tool.name || "Tool"}
                className="max-h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="empty-image h-[360px]">No image yet</div>
          )}
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#1B2AC5]">
              {tool.isBorrowed ? "Currently borrowed" : "Available now"}
            </p>

            <h1 className="text-4xl font-bold text-[#1f1f1f]">
              {tool.name || "Unnamed tool"}
            </h1>

            <p className="text-sm text-[#5f6368]">
              Owned by {owner?.name || "Neighbor"}
            </p>

            <p className="text-sm text-[#5f6368]">
              {owner?.neighborhood || "Unknown neighborhood"}
              {owner?.zipcode ? ` • ${owner.zipcode}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tagList.length ? (
              tagList.map((tag) => (
                <span key={tag} className="tag-green">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-[#5f6368]">No tags</span>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-[#1f1f1f]">
              Instructions
            </h2>
            <p className="leading-7 text-[#5f6368]">
              {tool["manual/instructions"] || "No instructions provided."}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-[#1f1f1f]">
              Replacement Cost
            </h2>
            <p className="text-[#5f6368]">
              {tool.replacementCost != null
                ? `$${tool.replacementCost}`
                : "Not provided"}
            </p>
          </div>

          {owner?.statement ? (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-[#1f1f1f]">
                About the lender
              </h2>
              <p className="leading-7 text-[#5f6368]">{owner.statement}</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
