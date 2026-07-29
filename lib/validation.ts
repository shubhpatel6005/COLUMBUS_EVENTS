import { z } from "zod";

export const contactSubjects = [
  "general",
  "sponsorship",
  "volunteer",
  "press",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(200),
  email: z.string().trim().email("Enter a valid email address."),
  subject: z.enum(contactSubjects, {
    message: "Choose a subject.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be under 5,000 characters."),
  // Hidden field real visitors never fill in; any value marks a bot. Left
  // unconstrained here (checked manually in the route) so a bot gets an
  // identical fake-success response instead of a distinguishing 400.
  honeypot: z.string().optional().default(""),
  turnstileToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
