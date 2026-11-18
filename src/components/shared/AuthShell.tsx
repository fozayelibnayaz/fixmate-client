import Link from "next/link";

export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-grid" />
      <div className="auth-inner">
        <Link href="/" className="brand-link"><span className="brand-mark">🔧</span>FixMate</Link>
        <div className="auth-card panel">
          <div className="sec-index">SECURE ACCESS</div>
          <h1 className="page-heading">{title}</h1>
          <p className="page-sub" style={{ marginBottom: 28 }}>{subtitle}</p>
          {children}
          <div className="divider" />
          <div className="text-sm text-center">{footer}</div>
        </div>
        <p className="text-xs text-center" style={{ color: "var(--dim)", marginTop: 18 }}>© 2026 FIXMATE · REQUEST · TRACK · PAY AFTER</p>
      </div>
    </div>
  );
}
