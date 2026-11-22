"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export const Modal = ({ open, onClose, title, description, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fm-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="fm-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
          <div>
            <h2 className="fm-h3">{title}</h2>
            {description ? <p className="fm-muted" style={{ margin: "8px 0 0", fontSize: 14 }}>{description}</p> : null}
          </div>
          <button className="fm-btn fm-btn-ghost fm-btn-sm" onClick={onClose} aria-label="Close dialog" style={{ padding: 0, width: 36 }}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
