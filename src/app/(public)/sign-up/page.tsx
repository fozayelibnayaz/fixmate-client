import type { Metadata } from "next";
import { AuthGuest } from "@/components/auth/auth-guest";
import { SignUpForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole = role === "technician" ? "technician" : "customer";
  return (
    <AuthGuest>
      <SignUpForm initialRole={initialRole} />
    </AuthGuest>
  );
}
