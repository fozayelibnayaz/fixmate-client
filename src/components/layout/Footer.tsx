import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand"><span className="brand-mark">🔧</span>FixMate</Link>
            <p>On-demand device and home appliance repair. Dispatch a verified technician, track the job, and pay only after the work is delivered.</p>
            <div className="socials">
              <a href="#" aria-label="X">𝕏</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="Facebook">f</a>
            </div>
          </div>
          <div><h4>Quick Links</h4><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/about">About</Link></div>
          <div><h4>Categories</h4><Link href="/services?category=Smartphone">Smartphone</Link><Link href="/services?category=AC">AC</Link><Link href="/services?category=Laptop+%26+PC">Laptop & PC</Link><Link href="/services?category=Electrical">Electrical</Link></div>
          <div><h4>Contact</h4><a href="mailto:hello@fixmate.test">hello@fixmate.test</a><a href="tel:+8801812345678">+880 1812 345 678</a><a href="#">Dhanmondi, Dhaka</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 FIXMATE · REPAIR SYSTEM</span><span>REQUEST · TRACK · PAY AFTER</span></div>
      </div>
    </footer>
  );
}
