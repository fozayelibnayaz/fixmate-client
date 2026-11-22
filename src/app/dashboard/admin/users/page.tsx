"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { useApiData } from "@/hooks/use-api-data";
import { useAuth } from "@/hooks/use-auth";
import { patch } from "@/lib/api";
import { shortDate } from "@/lib/format";
import type { Role, User } from "@/lib/types";

type RoleTarget = { user: User; role: Role };

export default function AdminUsersPage() {
  const { data, loading, refresh } = useApiData<{ users: User[] }>("/api/admin/users");
  const { user: me } = useAuth();
  const [target, setTarget] = useState<RoleTarget | null>(null);
  const [busy, setBusy] = useState(false);

  const confirmRoleChange = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await patch(`/api/admin/users/${target.user.id}/role`, { role: target.role });
      toast.success(`${target.user.name} is now a ${target.role}`);
      setTarget(null);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change role");
    } finally {
      setBusy(false);
    }
  };

  const users = data?.users ?? [];

  return (
    <>
      <PageHeader eyebrow="Admin dashboard" title="Manage Users" subtitle="Review accounts and assign roles. You cannot change your own role." />
      {loading ? <Spinner /> : users.length === 0 ? (
        <div className="fm-panel"><EmptyState icon="👥" title="No users yet" description="New accounts will appear here for review." /></div>
      ) : (
        <div className="fm-panel">
          <table className="fm-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Change role</th></tr></thead>
            <tbody>
              {users.map((user) => (
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
                        onChange={(event) => setTarget({ user, role: event.target.value as Role })}
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

      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title="Change user role?"
        description={target ? `${target.user.name} (${target.user.email}) will become ${target.role}. Their permissions change immediately.` : undefined}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button variant="ghost" onClick={() => setTarget(null)}>Keep current role</Button>
          <Button variant="blue" onClick={confirmRoleChange} disabled={busy}>{busy ? "Saving…" : "Confirm change"}</Button>
        </div>
      </Modal>
    </>
  );
}
