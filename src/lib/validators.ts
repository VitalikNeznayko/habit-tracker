import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email format");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Must include uppercase letter")
  .regex(/[0-9]/, "Must include number");

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(100, "Title is too long");

const descriptionSchema = z
  .string()
  .trim()
  .max(500, "Description is too long")
  .optional()
  .or(z.literal(""));


export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const createHabitSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
});

export const updateHabitSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
});
