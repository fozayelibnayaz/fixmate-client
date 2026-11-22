"use client";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/dashboard/shared";
import { Spinner } from "@/components/ui/misc";
import { useApiData } from "@/hooks/use-api-data";
import { patch } from "@/lib/api";
import { shortDate } from "@/lib/format";
import type { User } from "@/lib/types";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { data, loading, refresh } = useApiData<{ users: User[] }>("/api/admin/users");
  const { user: me } = useAuth();

  const changeRole = async (user: User, role: string) => {
    try {
      await patch(`/api/admin/users/${user.id}/role`, { role });
      toast.success(`${user.name} is now a ${role}`);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change role");
    }
  };

  return (
    <>
      <PageHeader eyebrow="Admin dashboard" title="Manage Users" subtitle="Review accounts and assign roles. You cannot change your own role." />
      {loading ? <Spinner /> : (
        <div className="fm-panel">
          <table className="fm-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Change role</th></tr></thead>
            <tbody>
              {(data?.users ?? []).map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {user.image ? <img src={user.image} alt="" className="fm-avatar" /> : <span className="fm-avatar" style={{ display: "grid", placeItems: "center", background: "var(--fm-ink)", color: "var(--fm-paper)", fontSize: 12 }}>{user.name.charAt(0)}</span>}
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td><span className={`fm-status ${user.role === "admin" ? "fm-status-indigo" : user.role === "technician" ? "fm-status-blue" : "fm-status-green"}`}>{user.role}</span></td>
                  <td>{shortDate(user.createdAt)}</td>
                  <td>
                    {user.email === me?.email ? (
                      <span className="fm-muted" style={{ fontSize: 12 }}>You</span>
                    ) : (
                      <select
                        className="fm-select"
                        style={{ maxWidth: 140, minHeight: 38 }}
                        value={user.role}
                        onChange={(event) => changeRole(user, event.target.value)}
                      >
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
