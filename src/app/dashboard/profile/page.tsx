"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
  const [session, setSession] = useState<any>(null);
  const [form, setForm] = useState({ name: "", phone: "", area: "", bio: "" });
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authClient.getSession().then((s: any) => {
      const u = s?.data?.user;
      setSession(s?.data);
      setForm({ name: u?.name || "", phone: u?.phone || "", area: u?.area || "", bio: u?.bio || "" });
      setImage(u?.image || "");
    });
  }, []);

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { method: "POST", body: fd });
    const json = await res.json();
    if (json.success) { setImage(json.data.url); toast.success("Image uploaded"); }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/api/users/profile", { method: "PATCH", body: JSON.stringify({ ...form, image }) });
      toast.success("Profile updated");
      // refresh session
      await authClient.getSession();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  const user = session?.user;
  return (
    <div>
      <h1 className="page-heading" style={{marginBottom:28}}>Update Profile</h1>
      <form onSubmit={save} className="panel space-y-4 max-w-2xl">
        <div className="flex items-center gap-4">
          <img src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name||"U")}&background=181c19&color=00e0c6`} className="w-20 h-20 rounded-xl" alt="" />
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Email (read-only)</label>
          <input value={user?.email || ""} readOnly className="field" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Role (read-only)</label>
          <input value={user?.role || ""} readOnly className="field" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Area</label>
          <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="field" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="field" rows={3} />
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary"><span>{saving ? "Saving..." : "Save"}</span></button>
      </form>
    </div>
  );
}
