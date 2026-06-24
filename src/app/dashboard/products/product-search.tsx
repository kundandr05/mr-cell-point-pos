"use client";

import { SearchInput } from "@/components/ui/search-input";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const handleSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`/dashboard/products?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <SearchInput 
      placeholder="Search products by name, SKU, or barcode..." 
      value={currentQuery}
      onChange={handleSearch}
      className="max-w-md w-full"
    />
  );
}
