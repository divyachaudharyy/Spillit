"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
// import { useState } from "react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 bg-black text-white border-b border-white/10 relative overflow-hidden border-bott">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <motion.button
            onClick={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition"
          >
            Spill It
          </motion.button>
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-md text-gray-300">
              {user.username || user.email}
            </span>

            <div className="relative">
              <Button
                onClick={() => {
                  signOut();
                }}
                className="bg-linear-to-r from-purple-500 to-blue-500 hover:scale-105 transition text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Link href="/sign-in">
              <Button className="bg-linear-to-r from-purple-500 to-blue-500 hover:scale-105 transition text-white">
                Enter 👀
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-purple-400 to-transparent opacity-70 blur-[1px]" />
    </nav>
  );
}
export default Navbar;
