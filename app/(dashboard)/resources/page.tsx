"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Package, Loader2, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource } from "@/types";

interface ResourceWithOwner extends Resource {
  owner: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    trust_score: number;
    is_verified_neighbor: boolean;
  };
}

/**
 * ResourcesPage — Public Library of shared items and skills.
 * Neighbors can browse, search, and request resources from their community.
 */
export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceWithOwner[]>([]);
  const [filteredResources, setFilteredResources] = useState<ResourceWithOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "item" | "skill">("all");

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch("/api/resources?status=available");
        const data = await response.json();
        if (data.success) {
          setResources(data.data || []);
          setFilteredResources(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch library resources:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResources();
  }, []);

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = resources.filter((res) => {
      const matchesQuery =
        res.name.toLowerCase().includes(lowerQuery) ||
        (res.description?.toLowerCase().includes(lowerQuery) ?? false);

      const matchesFilter = activeFilter === "all" || res.type === activeFilter;

      return matchesQuery && matchesFilter;
    });
    setFilteredResources(filtered);
  };

  const handleFilterChange = (filter: "all" | "item" | "skill") => {
    setActiveFilter(filter);
    const filtered = resources.filter((res) => {
      const matchesFilter = filter === "all" || res.type === filter;
      return matchesFilter;
    });
    setFilteredResources(filtered);
  };

  const handleRequest = (id: string) => {
    console.log("Requesting resource:", id);
    // Future: Logic to start conversation or request interaction
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Branded Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">
            Community sharing
          </p>
          <h1 className="text-5xl font-black tracking-tighter leading-none mb-3">
            Neighbor Library
          </h1>
          <p className="text-muted-foreground font-medium max-w-lg">
            Tools to borrow and skills to share, right in your neighborhood.
          </p>
        </div>
        <div className="flex bg-muted/30 p-1 rounded-xl border border-border/30 shrink-0">
          {(["all", "item", "skill"] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={cn(
                "px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? "All" : f === "item" ? "Tools" : "Skills"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto px-4">
        <SearchBar
          placeholder="Search for a drill, ladder, or cooking lesson..."
          onSearch={handleSearch}
          className="w-full"
        />
      </div>

      {/* Main Grid */}
      <div className="px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[320px] rounded-3xl bg-muted/20 border border-border/30 animate-pulse" />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-muted/10 rounded-[2rem] border-2 border-dashed border-border/30">
            <div className="bg-muted/50 p-6 rounded-full shadow-xl mb-6">
              <Package size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2">Nothing found yet</h3>
            <p className="text-muted-foreground font-medium max-w-sm">
              We couldn&apos;t find any resources matching your search. Try a different keyword or check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredResources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                onAction={handleRequest}
                className="animate-in fade-in zoom-in-95 duration-500"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
