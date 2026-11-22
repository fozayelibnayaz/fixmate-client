"use client";

import { PageHeader } from "@/components/dashboard/shared";
import { Spinner } from "@/components/ui/misc";
import { useApiData } from "@/hooks/use-api-data";
import { money, shortDate, truncate } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default function AdminTransactionsPage() {
  const { data, loading } = useApiData<{ payments: Payment[]; revenue: number }>("/api/admin/payments");

  return (
    <>
      <PageHeader eyebrow="Admin dashboard" title="Transactions" subtitle="Every payment recorded by Stripe." />
      <div style={{ marginBottom: 22, maxWidth: 300 }}>
        <div className="fm-stat"><div className="fm-stat-label">Total revenue</div><div className="fm-stat-value">{money(data?.revenue ?? 0)}</div></div>
      </div>
      {loading ? <Spinner /> : (
        <div className="fm-panel">
          <table className="fm-table">
            <thead><tr><th>Service</th><th>Customer</th><th>Technician</th><th>Amount</th><th>Transaction</th><th>Date</th></tr></thead>
            <tbody>
              {(data?.payments ?? []).map((payment) => (
                <tr key={payment._id}>
                  <td style={{ fontWeight: 650 }}>{payment.serviceTitle}</td>
                  <td>{payment.customerName}</td>
                  <td>{payment.technicianName}</td>
                  <td>{money(payment.amount)}</td>
                  <td className="fm-muted" title={payment.transactionId}>{truncate(payment.transactionId, 18)}</td>
                  <td>{shortDate(payment.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
