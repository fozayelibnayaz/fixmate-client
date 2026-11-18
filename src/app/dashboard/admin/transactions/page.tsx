"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";

export default function AdminTransactions() {
  const [payments, setPayments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    api("/api/admin/payments").then((r) => { setPayments(r.data || []); setTotal(r.totalRevenue || 0); }).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="page-heading" style={{marginBottom:28}}>Transactions</h1>
      <div className="panel mb-6">
        <p className="text-xs font-mono text-[var(--muted)] uppercase">Total Revenue</p>
        <p className="text-3xl font-bold mt-2 text-[var(--accent)]">${total}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[var(--muted)] font-mono text-xs uppercase"><th className="py-2">Customer</th><th>Technician</th><th>Service</th><th>Amount</th><th>Transaction ID</th><th>Date</th></tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t border-[var(--line)]">
                <td className="py-2">{p.customerName}</td>
                <td className="py-2">{p.technicianName}</td>
                <td className="py-2">{p.serviceTitle}</td>
                <td className="py-2">${p.amount}</td>
                <td className="py-2 text-xs font-mono">{p.transactionId}</td>
                <td className="py-2">{new Date(p.paidAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
