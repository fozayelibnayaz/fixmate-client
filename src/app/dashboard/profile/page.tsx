"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Field, TextareaField } from "@/components/ui/field";
import { useAuth } from "@/hooks/use-auth";
import { profileSchema, type ProfileValues } from "@/lib/schemas";
import { uploadImage } from "@/lib/upload";
import { useAppDispatch } from "@/store/hooks";
import { saveProfile } from "@/store/auth";

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema) });
  const image = watch("image");

  useEffect(() => {
    if (user) {
      reset({ name: user.name, phone: user.phone, area: user.area, bio: user.bio, image: user.image });
    }
  }, [user, reset]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("image", url, { shouldValidate: true });
      toast.success("Photo uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = handleSubmit(async (values) => {
    try {
      await dispatch(saveProfile(values)).unwrap();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your profile");
    }
  });

  return (
    <>
      <PageHeader eyebrow="All roles" title="Update Profile" subtitle="Your name and photo update everywhere instantly." />
      <div className="fm-panel" style={{ padding: 28, maxWidth: 720 }}>
        <form onSubmit={submit}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
            {image ? <img src={image} alt="Profile preview" className="fm-avatar" style={{ width: 64, height: 64 }} /> : (
              <span className="fm-avatar" style={{ width: 64, height: 64, display: "grid", placeItems: "center", background: "var(--fm-ink)", color: "var(--fm-paper)", fontSize: 22 }}>
                {user?.name.charAt(0)}
              </span>
            )}
            <label className="fm-btn fm-btn-ghost fm-btn-sm" style={{ cursor: "pointer" }}>
              {uploading ? <Loader2 size={15} /> : <ImagePlus size={15} />} Change photo
              <input type="file" accept="image/*" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
            </label>
          </div>
          <div className="fm-grid fm-grid-2" style={{ gap: 0, columnGap: 16 }}>
            <Field label="Full name" error={errors.name?.message} {...register("name")} />
            <Field label="Email" value={user?.email ?? ""} readOnly />
          </div>
          <div className="fm-grid fm-grid-2" style={{ gap: 0, columnGap: 16 }}>
            <Field label="Phone" placeholder="+8801…" {...register("phone")} />
            <Field label="Area" placeholder="Mirpur, Dhaka" {...register("area")} />
          </div>
          <Field label="Role" value={user?.role ?? ""} readOnly />
          <TextareaField label="Bio" placeholder="Tell customers about your experience…" {...register("bio")} />
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save profile"}</Button>
        </form>
      </div>
    </>
  );
}
