"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldShellProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

const FieldShell = ({ label, error, hint, children }: FieldShellProps) => (
  <div className="fm-field">
    <label className="fm-label">{label}</label>
    {children}
    {error ? <p className="fm-error">{error}</p> : hint ? <p className="fm-muted" style={{ fontSize: 12, marginTop: 6 }}>{hint}</p> : null}
  </div>
);

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const Field = ({ label, error, hint, ...props }: InputProps) => (
  <FieldShell label={label} error={error} hint={hint}>
    <input className="fm-input" {...props} />
  </FieldShell>
);

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const TextareaField = ({ label, error, ...props }: TextareaProps) => (
  <FieldShell label={label} error={error}>
    <textarea className="fm-textarea" {...props} />
  </FieldShell>
);

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: readonly string[];
};

export const SelectField = ({ label, error, options, ...props }: SelectProps) => (
  <FieldShell label={label} error={error}>
    <select className="fm-select" {...props}>
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </FieldShell>
);
