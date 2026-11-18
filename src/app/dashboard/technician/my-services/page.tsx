"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, Edit, Power } from "lucide-react";

export default function MyServices() {
  const [services, setServices] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => api("/api/services/mine").then((r) => setServices(r.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  async function toggle(s: any) {
    try {
      await api(`/api/services/${s._id}/availability`, { method: "PATCH", body: JSON.stringify({ isAvailable: !s.isAvailable }) });
      toast.success("Availability updated");
      load();
    } catch (e: any) { toast.error(e.message); }
  }

  async function remove(id: string) {
    try {
      await api(`/api/services/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      setDeleteId(null);
      load();
    } catch (e: any) { toast.error(e.message); }
  }

  async function saveEdit() {
    try {
      await api(`/api/services/${editId}`, { method: "PATCH", body: JSON.stringify(editForm) });
      toast.success("Updated (pending approval)");
      setEditId(null);
      load();
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Services</h1>
      {services.length === 0 ? (
        <div className="text-center py-20"><div className="text-5xl mb-4">🛠️</div><p className="text-[var(--muted)]">No services yet.</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[var(--muted)] font-mono text-xs uppercase"><th className="py-2">Image</th><th>Title</th><th>Category</th><th>Price</th><th>Status</th><th>Available</th><th>Actions</th></tr></thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="border-t border-[var(--line)]">
                  <td className="py-2"><img src={s.image} alt="" className="w-12 h-12 object-cover rounded-lg" /></td>
                  <td className="py-2 font-medium">{s.title}</td>
                  <td className="py-2">{s.category}</td>
                  <td className="py-2">${s.basePrice}</td>
                  <td className="py-2"><span className={`text-xs px-2 py-0.5 rounded ${s.approvalStatus === "approved" ? "bg-emerald-500/20 text-emerald-400" : s.approvalStatus === "rejected" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>{s.approvalStatus}</span></td>
                  <td className="py-2">
                    <button onClick={() => toggle(s)} className={`text-xs px-2 py-1 rounded ${s.isAvailable ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>{s.isAvailable ? "On" : "Off"}</button>
                  </td>
                  <td className="py-2 flex gap-2">
                    <button onClick={() => { setEditId(s._id); setEditForm({ title: s.title, description: s.description, basePrice: s.basePrice, estimatedDuration: s.estimatedDuration, serviceArea: s.serviceArea, image: s.image, serviceMode: s.serviceMode, category: s.category }); }} className="p-1 hover:text-[var(--accent)]"><Edit size={14} /></button>
                    <button onClick={() => setDeleteId(s._id)} className="p-1 hover:text-red-400"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editId && (
        <Modal title="Edit service" onClose={() => setEditId(null)}>
          <div className="space-y-3">
            <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" placeholder="Title" />
            <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" placeholder="Description" />
            <input type="number" value={editForm.basePrice} onChange={(e) => setEditForm({ ...editForm, basePrice: Number(e.target.value) })} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" placeholder="Price" />
            <input value={editForm.estimatedDuration} onChange={(e) => setEditForm({ ...editForm, estimatedDuration: e.target.value })} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" placeholder="Duration" />
            <input value={editForm.serviceArea} onChange={(e) => setEditForm({ ...editForm, serviceArea: e.target.value })} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" placeholder="Area" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditId(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={saveEdit} className="btn btn-primary">Save</button>
            </div>
          </div>
        </Modal>
      )}
      {deleteId && (
        <Modal title="Delete service?" onClose={() => setDeleteId(null)}>
          <p className="text-sm text-[var(--muted)] mb-4">This cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setDeleteId(null)} className="btn btn-ghost">No</button>
            <button onClick={() => remove(deleteId)} className="btn btn-primary">Yes, delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );
}
