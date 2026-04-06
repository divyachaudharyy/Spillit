import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be of atleast 2 characters")
  .max(20, "username should not be more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.email({ message: "Invalid email address" }),

  password: z.string().min(6, "Password must be at least 6 characters"),
});
