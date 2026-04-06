"use client";

import { motion } from "framer-motion";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden px-6">
      {/*  Background Glow */}
      <div className="absolute w-125 h-125 bg-purple-600 rounded-full blur-[150px] opacity-30 -top-25 -left-25" />
      <div className="absolute w-100 h-100 bg-blue-600 rounded-full blur-[120px] opacity-30 -bottom-25 -right-25" />

      {/*  Floating Messages */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 left-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm"
      >
        &quot;You’ve changed lately...&quot;
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-24 right-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm"
      >
        &quot;I lowkey admire you&quot;
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full text-xs font-medium text-purple-300"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.35)",
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block"
            style={{ boxShadow: "0 0 6px #a78bfa" }}
          />
          23,481 messages sent today
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-5"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          What do people{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            REALLY
          </span>{" "}
          think about you?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-lg text-white/50 mb-10 max-w-md leading-relaxed"
        >
          Share your link. Get anonymous messages from anyone.{" "}
          <span className="text-white/70">
            No filters. No sugarcoating. Just the raw truth.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-3 mb-12"
        >
          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-9 py-4 rounded-full text-base font-medium text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                boxShadow:
                  "0 0 30px rgba(124,58,237,0.45), 0 0 60px rgba(124,58,237,0.15)",
              }}
            >
              <span className="text-xl">🔗</span>
              Get your link for free
              <span className="text-sm opacity-70">→</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
