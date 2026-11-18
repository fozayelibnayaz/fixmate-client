import Link from "next/link";
export default function StatusShell({ icon, title, message, action, actionLabel }: { icon: string; title: string; message: string; action: string; actionLabel: string }) {
  return (
    <div className="auth-shell">
      <div className="auth-grid" />
      <div className="auth-inner" style={{ maxWidth: 520 }}>
        <Link href="/" className="brand-link justify-center"><span className="brand-mark">🔧</span>FixMate</Link>
        <div className="auth-card panel" style={{ textAlign: "center", marginTop: 22 }}>
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="page-heading">{title}</h1>
          <p className="page-sub" style={{ marginBottom: 26 }}>{message}</p>
          <Link href={action} className="btn btn-primary"><span>{actionLabel}</span></Link>
        </div>
      </div>
    </div>
  );
}
