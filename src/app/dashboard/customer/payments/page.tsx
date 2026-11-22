"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { useApiData } from "@/hooks/use-api-data";
import { downloadFile } from "@/lib/api";
import { money, shortDate, truncate } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default function CustomerPaymentsPage() {
  const { data, loading } = useApiData<{ payments: Payment[] }>("/api/payments/my");
  const [downloading, setDownloading] = useState<string | null>(null);
  const payments = data?.payments ?? [];
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const downloadInvoice = async (payment: Payment) => {
    setDownloading(payment._id);
    try {
      await downloadFile(`/api/payments/${payment._id}/invoice`, `fixmate-invoice-${payment._id}.pdf`);
      toast.success("Invoice downloaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not download invoice");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Customer dashboard" title="Payment History" subtitle="Every completed, paid job in one ledger." />
      <div style={{ marginBottom: 22, maxWidth: 260 }}><div className="fm-stat"><div className="fm-stat-label">Total paid</div><div className="fm-stat-value">{money(total)}</div></div></div>
      {loading ? <Spinner label="Loading payments…" /> : payments.length === 0 ? (
        <div className="fm-panel"><EmptyState icon="💳" title="No payments yet" description="Pay for a completed job and your receipt will appear here." /></div>
      ) : (
        <div className="fm-panel">
          <table className="fm-table">
            <thead><tr><th>Service</th><th>Technician</th><th>Amount</th><th>Transaction</th><th>Date</th><th>Invoice</th></tr></thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td style={{ fontWeight: 650 }}>{payment.serviceTitle}</td>
                  <td>{payment.technicianName}</td>
                  <td>{money(payment.amount)}</td>
                  <td className="fm-muted" title={payment.transactionId}>{truncate(payment.transactionId, 18)}</td>
                  <td>{shortDate(payment.paidAt)}</td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={() => downloadInvoice(payment)} disabled={downloading === payment._id}>
                      <Download size={14} /> {downloading === payment._id ? "Downloading…" : "PDF"}
                    </Button>
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
