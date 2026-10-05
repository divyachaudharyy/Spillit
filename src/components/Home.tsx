"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Subtle center glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">

        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Anonymous messages, reimagined
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-8xl">
          Say what you
          <br />
          <span className="text-white/40">really think.</span>
        </h1>

        {/* Description */}
        <p className="mt-8 max-w-lg text-base leading-relaxed text-white/45 sm:text-lg">
          A simple space for honest, anonymous messages.
          Share your link, hear what people really have to say,
          and keep the conversation private.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">

          <Link
            href="/sign-up"
            className="flex h-11 items-center justify-center rounded-md bg-white px-7 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            Create your page
          </Link>

          <Link
            href="/sign-in"
            className="flex h-11 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] px-7 text-sm font-medium text-white transition hover:bg-white/[0.08]"
          >
            Sign in
          </Link>

        </div>

        {/* Bottom detail */}
        <p className="mt-10 text-xs tracking-wide text-white/25">
          No identity required · Just say it
        </p>

      </div>
    </section>
  );
}