"use client";

import { AlertCircle, Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import type { Service, ServiceListResponse } from "@/lib/types";
import { ServiceCard } from "./service-card";
import { EmptyState, SkeletonCard } from "@/components/ui/misc";

export interface BrowseParams {
  q: string;
  category: string;
  mode: string;
  sort: string;
  page: number;
}

export const ServicesBrowser = ({ initial }: { initial: BrowseParams }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [params, setParams] = useState<BrowseParams>(initial);
  const [result, setResult] = useState<ServiceListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncUrl = useCallback(
    (next: BrowseParams) => {
      const query = new URLSearchParams();
      if (next.q) query.set("q", next.q);
      if (next.category) query.set("category", next.category);
      if (next.mode) query.set("mode", next.mode);
      if (next.sort && next.sort !== "newest") query.set("sort", next.sort);
      if (next.page > 1) query.set("page", String(next.page));
      router.replace(`${pathname}${query.size ? `?${query.toString()}` : ""}`, { scroll: false });
    },
    [pathname, router],
  );

  const update = (patch: Partial<BrowseParams>) => {
    const next = { ...params, ...patch, page: patch.page ?? 1 };
    setParams(next);
    syncUrl(next);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.category) query.set("category", params.category);
    if (params.mode) query.set("mode", params.mode);
    if (params.sort) query.set("sort", params.sort);
    query.set("page", String(params.page));

    apiFetch<ServiceListResponse>(`/api/services?${query.toString()}`)
      .then((data) => {
        if (active) {
          setResult(data);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setResult({ services: [], total: 0, page: 1, limit: 9, totalPages: 1 });
          setError("Make sure the FixMate API on port 4000 and MongoDB are running, then seed the demo data.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params]);

  const services: Service[] = result?.services ?? [];

  return (
    <section className="fm-section-sm">
      <div className="fm-container">
        <span className="fm-eyebrow">Browse the catalogue</span>
        <h1 className="fm-h2" style={{ marginTop: 16 }}>Find your <span className="fm-gradient-text">fix</span>.</h1>
        <p className="fm-lead">Approved services from verified technicians. Search, filter and sort — all handled on the server.</p>

        <div className="fm-panel cl-filter-panel" style={{ marginTop: 38, padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <Search size={17} style={{ position: "absolute", left: 14, top: 15, color: "var(--fm-muted)" }} />
              <input
                className="fm-input"
                style={{ paddingLeft: 42 }}
                placeholder="Search services…"
                value={params.q}
                onChange={(event) => update({ q: event.target.value })}
              />
            </div>
            <select className="fm-select" value={params.category} onChange={(event) => update({ category: event.target.value })}>
              <option value="">All categories</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select className="fm-select" value={params.mode} onChange={(event) => update({ mode: event.target.value })}>
              <option value="">Any mode</option>
              {SERVICE_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
            </select>
            <select className="fm-select" value={params.sort} onChange={(event) => update({ sort: event.target.value })}>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "26px 0 18px", gap: 12, flexWrap: "wrap" }}>
          <span className="fm-muted" style={{ fontSize: 14 }}>
            {loading ? "Loading services…" : `${result?.total ?? 0} ${result?.total === 1 ? "service" : "services"} found`}
          </span>
          {params.category ? (
            <button className="fm-pill" onClick={() => update({ category: "" })}>
              <SlidersHorizontal size={12} /> {params.category} ✕
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="fm-grid fm-grid-3">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : error ? (
          <div className="fm-panel" style={{ padding: 40, textAlign: "center", borderColor: "rgba(248,113,113,.35)" }}>
            <AlertCircle size={34} color="#f87171" aria-hidden="true" />
            <h2 style={{ fontSize: 22, marginTop: 16 }}>Could not load services</h2>
            <p className="fm-muted" style={{ margin: "10px auto 22px", maxWidth: 460, fontSize: 14 }}>{error}</p>
            <button className="cl-btn cl-btn-blue" type="button" onClick={() => setParams((current) => ({ ...current }))}>
              Try again
            </button>
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No matching services"
            description="Try a different search or clear your filters to see everything available."
          />
        ) : (
          <>
            <div className="fm-grid fm-grid-3">
              {services.map((service) => <ServiceCard key={service._id} service={service} />)}
            </div>
            {(result?.totalPages ?? 1) > 1 ? (
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
                <button className="fm-btn fm-btn-ghost fm-btn-sm" disabled={params.page <= 1} onClick={() => update({ page: params.page - 1 })}>Previous</button>
                <span className="fm-pill">Page {params.page} of {result?.totalPages}</span>
                <button className="fm-btn fm-btn-ghost fm-btn-sm" disabled={params.page >= (result?.totalPages ?? 1)} onClick={() => update({ page: params.page + 1 })}>Next</button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};
