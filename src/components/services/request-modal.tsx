"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, TextareaField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { post } from "@/lib/api";
import { requestSchema, type RequestValues } from "@/lib/schemas";
import type { Service, User } from "@/lib/types";

interface RequestModalProps {
  open: boolean;
  onClose: () => void;
  service: Service;
  user: User;
}

export const RequestModal = ({ open, onClose, service, user }: RequestModalProps) => {
  const [created, setCreated] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { customerPhone: user.phone, address: "", preferredDate: "", problemDescription: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await post("/api/bookings", { ...values, serviceId: service._id });
      setCreated(true);
      toast.success("Repair request sent to the technician");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the request");
    }
  });

  const close = () => {
    onClose();
    setCreated(false);
    reset();
  };

  if (created) {
    return (
      <Modal open={open} onClose={close} title="Request sent">
        <div style={{ textAlign: "center", padding: "14px 0 6px" }}>
          <CheckCircle2 size={52} color="#16824a" style={{ margin: "0 auto 18px" }} />
          <p className="fm-muted" style={{ lineHeight: 1.6 }}>
            {service.technicianName} has been notified. Track the job from your dashboard.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <Link href="/dashboard/customer/bookings" className="fm-btn fm-btn-primary" onClick={close}>My Bookings</Link>
            <Button variant="ghost" onClick={close}>Close</Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Request a repair"
      description={`${service.title} · ${service.technicianName}`}
    >
      <form onSubmit={onSubmit}>
        <div className="fm-grid fm-grid-2" style={{ gap: 0, columnGap: 14 }}>
          <Field label="Name" value={user.name} readOnly />
          <Field label="Email" value={user.email} readOnly />
        </div>
        <Field label="Phone" placeholder="+8801…" error={errors.customerPhone?.message} {...register("customerPhone")} />
        <Field label="Service / pickup address" placeholder="House, road, area, city" error={errors.address?.message} {...register("address")} />
        <Field
          label="Preferred date"
          type="date"
          min={today}
          error={errors.preferredDate?.message}
          {...register("preferredDate")}
        />
        <TextareaField
          label="What's wrong with it?"
          placeholder="Tell the technician what happened, when it started and anything you already tried…"
          error={errors.problemDescription?.message}
          {...register("problemDescription")}
        />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
          <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : <>Send request <CalendarDays size={15} /></>}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
