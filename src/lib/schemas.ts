import { z } from "zod";
import { CATEGORIES, SERVICE_MODES } from "./constants";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Add at least one uppercase letter")
    .regex(/[a-z]/, "Add at least one lowercase letter"),
  role: z.enum(["customer", "technician"]),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const requestSchema = z.object({
  customerPhone: z.string().trim().min(6, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your service address"),
  preferredDate: z.string().min(1, "Choose a preferred date"),
  problemDescription: z
    .string()
    .trim()
    .min(20, "Describe the problem in at least 20 characters"),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(3, "Title is too short"),
  category: z.enum(CATEGORIES),
  description: z.string().trim().min(10, "Add a longer description"),
  image: z.string().min(1, "Upload a service image"),
  basePrice: z.number({ message: "Price must be greater than zero" }).positive("Price must be greater than zero"),
  estimatedDuration: z.string().trim().min(1, "Add an estimated duration"),
  serviceMode: z.enum(SERVICE_MODES),
  serviceArea: z.string().trim().min(2, "Add the service area"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  phone: z.string().trim().optional(),
  area: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  image: z.string().optional(),
});

export const finalAmountSchema = z.object({
  finalAmount: z.number({ message: "Enter an amount greater than zero" }).positive("Enter an amount greater than zero"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
export type RequestValues = z.infer<typeof requestSchema>;
export type ServiceValues = z.infer<typeof serviceSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
