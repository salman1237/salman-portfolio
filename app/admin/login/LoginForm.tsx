"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions/auth";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="font-mono text-xs text-paper/60">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="min-h-[44px] rounded-lg border border-paper/20 bg-transparent px-3 py-2 text-base text-paper outline-none focus:border-accent-3"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="font-mono text-xs text-paper/60">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-[44px] rounded-lg border border-paper/20 bg-transparent px-3 py-2 text-base text-paper outline-none focus:border-accent-3"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm font-semibold text-accent">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 min-h-[44px] rounded-full border-2 border-accent bg-accent px-5 py-3 text-sm font-bold text-ink transition hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
