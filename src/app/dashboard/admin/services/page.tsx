"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [filter, setFilter] = useState("pending");
  const load = () => {
    const qs = filter !== "all" ? `?status=${filter}` : "";
    api(`/api/admin/services${qs}`).then((r) => setServices(r.data || [])).catch(() => {});
  };
  useEffect(() => { load(); }, [filter]);

  async function approve(id: string, status: string) {
    try {
      await api(`/api/admin/services/${id}/approval`, { method: "PATCH", body: JSON.stringify({ approvalStatus: status }) });
      toast.success(`Service ${status}`);
      load();
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Service Approval</h1>
      <div className="flex gap-2 mb-4">
        {["pending", "approved", "rejected", "all"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`btn text-xs ${filter === s ? "btn-primary" : "btn-ghost"}`}>{s}</button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[var(--muted)] font-mono text-xs uppercase"><th className="py-2">Image</th><th>Title</th><th>Tech</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id} className="border-t border-[var(--line)]">
                <td className="py-2"><img src={s.image} alt="" className="w-12 h-12 object-cover rounded-lg" /></td>
                <td className="py-2 font-medium">{s.title}</td>
                <td className="py-2">{s.technicianName}</td>
                <td className="py-2">{s.category}</td>
                <td className="py-2">{s.approvalStatus}</td>
                <td className="py-2 flex gap-2">
                  <button onClick={() => approve(s._id, "approved")} className="btn btn-primary text-xs">Approve</button>
                  <button onClick={() => approve(s._id, "rejected")} className="btn btn-ghost text-xs text-red-400">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
