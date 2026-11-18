import ScrollChrome from "@/components/ScrollChrome";
import RevealObserver from "@/components/RevealObserver";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollChrome />
      <RevealObserver />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
