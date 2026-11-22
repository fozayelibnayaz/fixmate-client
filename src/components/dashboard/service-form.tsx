"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextareaField } from "@/components/ui/field";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import { serviceSchema, type ServiceValues } from "@/lib/schemas";
import { uploadImage } from "@/lib/upload";

export const ServiceForm = ({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<ServiceValues>;
  onSubmit: (values: ServiceValues) => Promise<void>;
  submitLabel: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      category: undefined,
      description: "",
      image: "",
      basePrice: 0,
      estimatedDuration: "",
      serviceMode: undefined,
      serviceArea: "",
      ...initial,
    },
  });
  const image = watch("image");

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("image", url, { shouldValidate: true });
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the service");
    }
  });

  return (
    <form onSubmit={submit}>
      <div className="fm-grid fm-grid-2" style={{ gap: 0, columnGap: 16 }}>
        <Field label="Service title" placeholder="e.g. iPhone Screen Replacement" error={errors.title?.message} {...register("title")} />
        <SelectField label="Category" options={CATEGORIES} error={errors.category?.message} {...register("category")} />
      </div>
      <TextareaField label="Description" placeholder="What does this service include?" error={errors.description?.message} {...register("description")} />
      <div className="fm-grid fm-grid-2" style={{ gap: 0, columnGap: 16 }}>
        <Field label="Starting price (BDT)" type="number" step="1" min="1" error={errors.basePrice?.message} {...register("basePrice", { valueAsNumber: true })} />
        <Field label="Estimated duration" placeholder="e.g. 2-3 hours" error={errors.estimatedDuration?.message} {...register("estimatedDuration")} />
      </div>
      <div className="fm-grid fm-grid-2" style={{ gap: 0, columnGap: 16 }}>
        <SelectField label="Service mode" options={SERVICE_MODES} error={errors.serviceMode?.message} {...register("serviceMode")} />
        <Field label="Service area" placeholder="e.g. Dhanmondi, Dhaka" error={errors.serviceArea?.message} {...register("serviceArea")} />
      </div>

      <div className="fm-field">
        <label className="fm-label">Service image</label>
        <label className="fm-card" style={{ padding: 22, display: "grid", placeItems: "center", gap: 10, cursor: "pointer", minHeight: 170 }}>
          {uploading ? <Loader2 size={28} className="fm-muted" /> : <ImagePlus size={28} color="var(--fm-blue)" />}
          <span style={{ fontSize: 13, fontWeight: 650 }}>{uploading ? "Uploading…" : "Click to upload a photo"}</span>
          <span className="fm-muted" style={{ fontSize: 12 }}>PNG or JPG · uploaded securely</span>
          <input type="file" accept="image/*" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
        </label>
        {image ? <img src={image} alt="Preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 14, marginTop: 12 }} /> : null}
        {errors.image?.message ? <p className="fm-error">{errors.image.message}</p> : null}
      </div>

      <Button type="submit" block disabled={isSubmitting || uploading}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
};
