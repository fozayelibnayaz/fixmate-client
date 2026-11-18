"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const load = () => api("/api/admin/users").then((r) => setUsers(r.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  async function changeRole(id: string, role: string) {
    try {
      await api(`/api/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
      toast.success("Role updated");
      load();
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <h1 className="page-heading" style={{marginBottom:28}}>Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[var(--muted)] font-mono text-xs uppercase"><th className="py-2">Photo</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-[var(--line)]">
                <td className="py-2"><img src={u.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name||"U")}&background=181c19&color=00e0c6`} className="w-9 h-9 rounded-full" alt="" /></td>
                <td className="py-2">{u.name}</td>
                <td className="py-2 text-[var(--muted)]">{u.email}</td>
                <td className="py-2 capitalize">{u.role}</td>
                <td className="py-2 text-[var(--muted)]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                <td className="py-2">
                  <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)} className="bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-2 py-1 text-xs">
                    <option value="customer">customer</option>
                    <option value="technician">technician</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
