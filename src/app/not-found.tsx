import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <div className="text-8xl mb-4">🔧</div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-[var(--muted)] mb-6">This page got broken — like a device needing repair.</p>
        <Link href="/" className="btn btn-primary"><span>Back to Home</span></Link>
      </div>
    </div>
  );
}
