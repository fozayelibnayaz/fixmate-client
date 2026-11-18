"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { api, setToken } from "@/lib/utils";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/utils";

export default function AddService() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [form, setForm] = useState({ title: "", category: "Smartphone", description: "", basePrice: "", estimatedDuration: "", serviceMode: "Home Visit", serviceArea: "" });
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { authClient.getSession().then((s: any) => setSession(s?.data ?? null)); }, []);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) { setImage(json.data.url); toast.success("Image uploaded"); }
      else toast.error("Upload failed");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api("/api/services", {
        method: "POST",
        body: JSON.stringify({ ...form, basePrice: Number(form.basePrice), image }),
      });
      toast.success("Service submitted for approval");
      router.push("/dashboard/technician/my-services");
    } catch (err: any) { toast.error(err.message); }
    finally { setSubmitting(false); }
  }

  const user = session?.user;
  return (
    <div>
      <h1 className="page-heading" style={{marginBottom:28}}>Add a Service</h1>
      <form onSubmit={onSubmit} className="panel space-y-4 max-w-2xl">
        <div>
          <label className="text-xs text-[var(--muted)]">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--muted)]">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="field">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">Service Mode</label>
            <select value={form.serviceMode} onChange={(e) => setForm({ ...form, serviceMode: e.target.value })} className="field">
              <option>Home Visit</option>
              <option>Shop Drop-off</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Description</label>
          <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="field" rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--muted)]">Base Price (USD)</label>
            <input type="number" min="1" required value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} className="field" />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">Estimated Duration</label>
            <input required value={form.estimatedDuration} onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })} className="field" placeholder="2-3 hours" />
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Service Area</label>
          <input required value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} className="field" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Technician Name (read-only)</label>
          <input value={user?.name || ""} readOnly className="field" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Service Image</label>
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} className="w-full text-sm" />
          {uploading && <p className="text-xs text-[var(--muted)]">Uploading...</p>}
          {image && <img src={image} alt="" className="mt-2 h-24 rounded-lg" />}
        </div>
        <button type="submit" disabled={submitting || !image} className="btn btn-primary"><span>{submitting ? "Saving..." : "Save Service"}</span></button>
      </form>
    </div>
  );
}
