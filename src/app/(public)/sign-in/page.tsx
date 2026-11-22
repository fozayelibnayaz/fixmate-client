import type { Metadata } from "next";
import { AuthGuest } from "@/components/auth/auth-guest";
import { SignInForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "" } = await searchParams;
  return (
    <AuthGuest>
      <SignInForm next={next} />
    </AuthGuest>
  );
}
