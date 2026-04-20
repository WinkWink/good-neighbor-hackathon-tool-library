"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AuthUser = {
  email?: string;
} | null;

export default function Navbar() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user ? { email: user.email ?? "" } : null);
      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email ?? "" } : null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="border-b border-white/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/branding/toolbox-logo-stacked.png"
            alt="Good Neighbor Toolbox"
            width={220}
            height={60}
            priority
            className="h-auto w-[180px] md:w-[220px]"
          />
        </Link>

        {loading ? (
          <div className="text-sm text-white/70">Loading...</div>
        ) : user ? (
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/tools/new"
              className="text-sm font-medium text-white/90 hover:text-white"
            >
              Add Tool
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white/90 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-white/90 hover:text-white"
            >
              Profile
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/browse"
              className="text-sm font-medium text-white/90 hover:text-white"
            >
              Browse Tools
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white/90 hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#F4FF52] px-4 py-2 text-sm font-extrabold !text-[#1B2AC5] transition hover:opacity-90"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
