"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/utils";
import { FALLBACK_SERVICES } from "@/lib/fallback";
import { Search, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["", "Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"];

function ServicesContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get("q") || "");
  const [category, setCategory] = useState(sp.get("category") || "");
  const [serviceMode, setServiceMode] = useState(sp.get("serviceMode") || "");
  const [sort, setSort] = useState(sp.get("sort") || "newest");
  const [page, setPage] = useState(Number(sp.get("page") || 1));
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const syncUrl = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    const vals: Record<string, string> = { q, category, serviceMode, sort, page: String(page), ...overrides };
    Object.entries(vals).forEach(([k, v]) => { if (v && v !== "1" || (k === "page" && v !== "1")) if (v) params.set(k, v); });
    // simpler:
    const p2 = new URLSearchParams();
    if (vals.q) p2.set("q", vals.q);
    if (vals.category) p2.set("category", vals.category);
    if (vals.serviceMode) p2.set("serviceMode", vals.serviceMode);
    if (vals.sort && vals.sort !== "newest") p2.set("sort", vals.sort);
    if (vals.page && vals.page !== "1") p2.set("page", vals.page);
    router.replace(`/services?${p2.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (serviceMode) params.set("serviceMode", serviceMode);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "12");
    setLoading(true);
    api(`/api/services?${params.toString()}`)
      .then((r) => { setData(r.data?.length ? r.data : FALLBACK_SERVICES); setTotal(r.total || FALLBACK_SERVICES.length); setPages(r.pages || 1); })
      .catch(() => { setData(FALLBACK_SERVICES); setTotal(FALLBACK_SERVICES.length); setPages(1); })
      .finally(() => setLoading(false));
  }, [q, category, serviceMode, sort, page]);

  // sync from URL on mount
  useEffect(() => {
    setQ(sp.get("q") || "");
    setCategory(sp.get("category") || "");
    setServiceMode(sp.get("serviceMode") || "");
    setSort(sp.get("sort") || "newest");
    setPage(Number(sp.get("page") || 1));
  }, [sp]);

  return (
    <div className="page-wrap">
      <div className="sec-index">BROWSE SERVICES</div>
      <h1 className="sec-title" style={{ marginBottom: 24 }}>Find a <em>repair.</em></h1>
      <div className="flex flex-wrap gap-3 mb-8 items-center">
        <div className="flex items-center gap-2 bg-[var(--panel)] border border-[var(--line)] rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search size={16} className="text-[var(--muted)]" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by title or category..." className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="bg-[var(--panel)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c || "All categories"}</option>)}
        </select>
        <select value={serviceMode} onChange={(e) => { setServiceMode(e.target.value); setPage(1); }} className="bg-[var(--panel)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm">
          <option value="">All modes</option>
          <option value="Home Visit">Home Visit</option>
          <option value="Shop Drop-off">Shop Drop-off</option>
        </select>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="bg-[var(--panel)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="text-[var(--muted)]">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔧</div>
          <p className="text-[var(--muted)]">No services found.</p>
          <Link href="/services" className="btn btn-ghost mt-4"><span>Clear filters</span></Link>
        </div>
      ) : (
        <>
          <div className="grid-services">
            {data.map((s, i) => (
              <article key={s._id} className="service-card">
                <div className="service-img">
                  {s.image ? <img src={s.image} alt={s.title} className="w-full h-full object-cover" /> : "🔧"}
                  <span className="service-cat">{s.category}</span>
                </div>
                <div className="service-body">
                  <h3>{s.title}</h3>
                  <div className="service-meta">
                    <span className="badge">{s.serviceMode}</span>
                    <span className="badge">{s.serviceArea}</span>
                    <span className="badge">{s.technicianName}</span>
                  </div>
                  <div className="service-foot">
                    <span className="service-price">${s.basePrice}<small> starting</small></span>
                    <Link href={`/services/${s._id}`} className="service-go">view →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {/* pagination */}
          <div className="flex justify-center gap-2 mt-10">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="btn btn-ghost">Prev</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`btn ${n === page ? "btn-primary" : "btn-ghost"}`}>{n}</button>
            ))}
            <button disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} className="btn btn-ghost">Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="container py-20">Loading...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
