"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export function NewsletterSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <p className={cn("text-sm font-medium text-foreground", className)}>
        You&apos;re on the list — thanks for subscribing.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-wrap items-start gap-2", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
      >
        {status === "submitting" ? "Joining…" : "Join our list"}
      </button>
      {error && (
        <p role="alert" className="w-full text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
