"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="relative z-50 w-full border-b border-white/10 bg-black text-white border-b border-white/10 bg-black/80 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-white"
        >
          spillit<span className="text-white/40">.</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden text-sm text-white/50 sm:block">
                {user.username || user.email}
              </span>

              <Button
                type="button"
                onClick={() => signOut()}
                className="h-9 rounded-md border border-white/15 bg-white/5 px-4 text-sm text-white hover:bg-white/10"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden text-sm text-white/60 transition hover:text-white sm:block"
              >
                Sign in
              </Link>

              <Link href="/sign-up">
                <Button
                  type="button"
                  className="h-9 rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-gray-200"
                >
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;