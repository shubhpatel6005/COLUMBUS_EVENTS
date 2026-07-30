"use client";

import { useId, useState } from "react";

import { PlaceholderMark } from "@/components/content/placeholder-mark";
import { cn } from "@/lib/utils";
import { taxDisclaimer } from "@/content/donate";

const PRESET_AMOUNTS = [25, 50, 100];

export function Donate() {
  const [interval, setInterval] = useState<"once" | "monthly">("once");
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(50);
  const [customAmount, setCustomAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const customInputId = useId();

  const amountDollars =
    selectedAmount === "custom" ? Number(customAmount) : selectedAmount;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!amountDollars || Number.isNaN(amountDollars) || amountDollars <= 0) {
      setError("Enter a valid donation amount.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: Math.round(amountDollars * 100),
          interval,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section
      id="donate"
      className="scroll-mt-20 border-t border-border bg-background px-4 py-24"
    >
      <div className="mx-auto max-w-lg text-center">
        <p className="font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
          Donate
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Support Our Events
        </h2>
        <p className="mt-4 text-muted-foreground">
          <PlaceholderMark>{taxDisclaimer}</PlaceholderMark>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 text-left">
          <div
            role="radiogroup"
            aria-label="Donation frequency"
            className="mx-auto flex w-fit rounded-lg border border-border bg-card p-1"
          >
            {(["once", "monthly"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={interval === value}
                onClick={() => setInterval(value)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  interval === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value === "once" ? "One-time" : "Monthly"}
              </button>
            ))}
          </div>

          <div
            role="radiogroup"
            aria-label="Donation amount"
            className="mt-6 grid grid-cols-4 gap-3"
          >
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                role="radio"
                aria-checked={selectedAmount === amount}
                onClick={() => setSelectedAmount(amount)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-semibold",
                  selectedAmount === amount
                    ? "border-primary bg-primary/10 text-turmeric"
                    : "border-border text-foreground hover:bg-muted",
                )}
              >
                ${amount}
              </button>
            ))}
            <button
              type="button"
              role="radio"
              aria-checked={selectedAmount === "custom"}
              onClick={() => setSelectedAmount("custom")}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-semibold",
                selectedAmount === "custom"
                  ? "border-primary bg-primary/10 text-turmeric"
                  : "border-border text-foreground hover:bg-muted",
              )}
            >
              Custom
            </button>
          </div>

          {selectedAmount === "custom" && (
            <div className="mt-4">
              <label
                htmlFor={customInputId}
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Custom amount (USD)
              </label>
              <input
                id={customInputId}
                type="number"
                min={1}
                step="1"
                inputMode="decimal"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                placeholder="75"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              />
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
          >
            {submitting
              ? "Redirecting to checkout…"
              : `Donate $${amountDollars || 0}${interval === "monthly" ? "/month" : ""}`}
          </button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            You&apos;ll be redirected to Stripe&apos;s secure checkout.
          </p>
        </form>
      </div>
    </section>
  );
}
