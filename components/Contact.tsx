"use client";

import { useState } from "react";
import type { Profile } from "@prisma/client";

function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — fail silently, text is still selectable
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="min-w-0 break-all font-mono text-sm sm:text-lg">{value}</span>
      <button
        onClick={copy}
        className="flex-none rounded-full border border-paper/20 px-3 py-1.5 font-mono text-xs text-paper hover:border-accent-3 hover:text-accent-3"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function Contact({ profile }: { profile: Profile }) {
  return (
    <footer id="contact" className="bg-ink pb-12 pt-20 text-paper">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <h2 className="text-balance font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
          Let&apos;s build something.
        </h2>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-3">
            <CopyField value={profile.email} />
            <CopyField value={profile.phone} />
          </div>
          <div className="flex flex-wrap gap-6">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-paper hover:text-accent-3"
            >
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-paper hover:text-accent-3"
            >
              GitHub
            </a>
            <a
              href={profile.codeforces}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-paper hover:text-accent-3"
            >
              Codeforces
            </a>
            <a
              href={profile.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-paper hover:text-accent-3"
            >
              LeetCode
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap justify-between gap-2 border-t border-paper/15 pt-6">
          <span className="font-mono text-xs text-paper/60">
            {profile.location}
          </span>
          <span className="font-mono text-xs text-paper/60">
            {profile.name}, 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
