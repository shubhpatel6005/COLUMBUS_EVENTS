"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

import { contactSubjects } from "@/lib/validation";
import { cn } from "@/lib/utils";

const subjectLabels: Record<(typeof contactSubjects)[number], string> = {
  general: "General",
  sponsorship: "Sponsorship",
  volunteer: "Volunteer",
  press: "Press",
};

declare global {
  interface Window {
    onTurnstileVerified?: (token: string) => void;
  }
}

function fieldClass(hasError: boolean) {
  return cn(
    "w-full rounded-lg border bg-background px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    hasError ? "border-destructive" : "border-input",
  );
}

export function Contact() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();
  const errorId = useId();

  useEffect(() => {
    window.onTurnstileVerified = setTurnstileToken;
    return () => {
      window.onTurnstileVerified = undefined;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setErrorField(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      honeypot: String(formData.get("company") ?? ""),
      turnstileToken,
    };

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setErrorField(data.field ?? null);
        setStatus("idle");
        return;
      }

      setStatus("success");
      formRef.current?.reset();
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <section
        id="contact"
        className="scroll-mt-20 border-t border-border bg-background px-4 py-24 text-center"
      >
        <p className="font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
          Contact
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Message sent
        </h2>
        <p className="mt-4 text-muted-foreground">Thanks for reaching out.</p>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-border bg-background px-4 py-24"
    >
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <p className="font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
            Contact
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Get in Touch
          </h2>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 space-y-5 text-left"
        >
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label
              htmlFor={nameId}
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Name
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              required
              aria-invalid={errorField === "name"}
              aria-describedby={errorField === "name" ? errorId : undefined}
              className={fieldClass(errorField === "name")}
            />
          </div>

          <div>
            <label
              htmlFor={emailId}
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              required
              aria-invalid={errorField === "email"}
              aria-describedby={errorField === "email" ? errorId : undefined}
              className={fieldClass(errorField === "email")}
            />
          </div>

          <div>
            <label
              htmlFor={subjectId}
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Subject
            </label>
            <select
              id={subjectId}
              name="subject"
              required
              defaultValue="general"
              aria-invalid={errorField === "subject"}
              aria-describedby={
                errorField === "subject" ? errorId : undefined
              }
              className={fieldClass(errorField === "subject")}
            >
              {contactSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subjectLabels[subject]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={messageId}
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Message
            </label>
            <textarea
              id={messageId}
              name="message"
              required
              rows={5}
              aria-invalid={errorField === "message"}
              aria-describedby={
                errorField === "message" ? errorId : undefined
              }
              className={fieldClass(errorField === "message")}
            />
          </div>

          {siteKey && (
            <>
              <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="afterInteractive"
              />
              <div
                className="cf-turnstile"
                data-sitekey={siteKey}
                data-callback="onTurnstileVerified"
              />
            </>
          )}

          {error && (
            <p id={errorId} role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
