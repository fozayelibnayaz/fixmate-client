"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "blue" | "ghost" | "danger";

const variantClass: Record<Variant, string> = {
  primary: "fm-btn-primary",
  blue: "fm-btn-blue",
  ghost: "fm-btn-ghost",
  danger: "fm-btn-danger",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "md" | "sm";
  block?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  block,
  className = "",
  children,
  ...props
}: ButtonProps) => (
  <button
    className={`fm-btn ${variantClass[variant]} ${size === "sm" ? "fm-btn-sm" : ""} ${block ? "fm-btn-block" : ""} ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: "md" | "sm";
  block?: boolean;
  className?: string;
  children: ReactNode;
}

export const ButtonLink = ({
  href,
  variant = "primary",
  size = "md",
  block,
  className = "",
  children,
}: ButtonLinkProps) => (
  <Link
    href={href}
    className={`fm-btn ${variantClass[variant]} ${size === "sm" ? "fm-btn-sm" : ""} ${block ? "fm-btn-block" : ""} ${className}`}
  >
    {children}
  </Link>
);
