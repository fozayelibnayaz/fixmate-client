"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { DASHBOARD_HOME } from "@/lib/constants";
import { signInSchema, signUpSchema, type SignInValues, type SignUpValues } from "@/lib/schemas";
import type { Role } from "@/lib/types";
import { useAppDispatch } from "@/store/hooks";
import { signIn as signInThunk, signUp as signUpThunk } from "@/store/auth";

const AuthShell = ({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) => (
  <section className="fm-section-sm" style={{ minHeight: "calc(100dvh - 64px)" }}>
    <div className="fm-narrow" style={{ maxWidth: 520 }}>
      <span className="fm-eyebrow">{eyebrow}</span>
      <h1 className="fm-h2" style={{ fontSize: "clamp(34px, 5vw, 54px)", margin: "14px 0 0" }}>{title}</h1>
      <p className="fm-lead" style={{ fontSize: 16 }}>{subtitle}</p>
      <div className="fm-panel" style={{ padding: 28, marginTop: 32 }}>{children}</div>
      <p className="fm-muted" style={{ textAlign: "center", fontSize: 14, marginTop: 22 }}>{footer}</p>
    </div>
  </section>
);

export const SignUpForm = ({ initialRole }: { initialRole: "customer" | "technician" }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "technician">(initialRole);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: initialRole },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const user = await dispatch(signUpThunk(values)).unwrap();
      toast.success(`Welcome to FixMate, ${user.name.split(" ")[0]}!`);
      router.push(DASHBOARD_HOME[user.role as Role]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create your account");
    }
  });

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account."
      subtitle="Choose how you'll use FixMate."
      footer={<>Already have an account? <Link href="/sign-in" style={{ color: "var(--fm-blue)", fontWeight: 650 }}>Sign in</Link></>}
    >
      <form onSubmit={submit}>
        <label className="fm-label">I am a</label>
        <div className="fm-grid fm-grid-2" style={{ gap: 10, marginBottom: 20 }}>
          {(["customer", "technician"] as const).map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                setRole(option);
                setValue("role", option);
              }}
              className="fm-card"
              style={{
                padding: 16,
                textAlign: "left",
                borderColor: role === option ? "var(--fm-blue)" : "var(--fm-line)",
                boxShadow: role === option ? "0 0 0 2px rgba(0,85,255,.14)" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ textTransform: "capitalize" }}>{option}</strong>
                {role === option ? <Check size={16} color="var(--fm-blue)" /> : null}
              </div>
              <span className="fm-muted" style={{ fontSize: 12 }}>
                {option === "customer" ? "Book repairs and track jobs" : "Offer services and manage requests"}
              </span>
            </button>
          ))}
        </div>
        <Field label="Full name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
        <Field label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
        <Field label="Password" type="password" placeholder="At least 6 characters" error={errors.password?.message} {...register("password")} />
        <p className="fm-muted" style={{ fontSize: 12, margin: "-6px 0 18px" }}>
          Must include an uppercase and a lowercase letter.
        </p>
        <Button type="submit" block disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : <>Create account <ArrowRight size={16} /></>}
        </Button>
      </form>
    </AuthShell>
  );
};

export const SignInForm = ({ next }: { next: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const user = await dispatch(signInThunk(values)).unwrap();
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      const target = next.startsWith("/") ? next : DASHBOARD_HOME[user.role as Role];
      router.push(target);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid email or password");
    }
  });

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to FixMate."
      subtitle="Pick up where you left off — your jobs and dashboard are waiting."
      footer={<>New here? <Link href="/sign-up" style={{ color: "var(--fm-blue)", fontWeight: 650 }}>Create an account</Link></>}
    >
      <form onSubmit={submit}>
        <Field label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
        <Field label="Password" type="password" placeholder="Your password" error={errors.password?.message} {...register("password")} />
        <Button type="submit" block disabled={isSubmitting} style={{ marginTop: 8 }}>
          {isSubmitting ? "Signing in…" : <>Sign in <ArrowRight size={16} /></>}
        </Button>
      </form>
    </AuthShell>
  );
};
