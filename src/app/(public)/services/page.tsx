import type { Metadata } from "next";
import { ServicesBrowser } from "@/components/services/services-browser";

export const metadata: Metadata = {
  title: "Browse Services",
  description: "Browse approved repair services from verified technicians.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const value = (param: string | string[] | undefined) => (Array.isArray(param) ? param[0] : param) ?? "";

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return (
    <ServicesBrowser
      initial={{
        q: value(params.q),
        category: value(params.category),
        mode: value(params.mode),
        sort: value(params.sort) || "newest",
        page: Math.max(1, Number(value(params.page)) || 1),
      }}
    />
  );
}
