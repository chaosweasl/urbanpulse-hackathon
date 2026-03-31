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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-blue-50/30 p-8 md:p-12 rounded-[2.5rem] border border-blue-100/50">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-600/20">
              <Library className="text-white h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tight leading-none">
              Neighbor Library
            </h1>
          </div>
          <p className="text-blue-900/60 font-medium text-lg md:text-xl leading-relaxed">
            A collaborative library of tools to borrow and skills to learn, right here in your neighborhood.
          </p>
        </div>

        {/* Filter Pill UI */}
        <div className="flex bg-white/50 p-1.5 rounded-2xl border border-blue-100/50 shadow-sm shrink-0 self-start md:self-center">
          {(["all", "item", "skill"] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                activeFilter === f
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-blue-900/40 hover:text-blue-950 hover:bg-blue-50"
              )}
            >
              {f === "all" ? "Everything" : f === "item" ? "Tools" : "Skills"}
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
          <div className="flex flex-col items-center justify-center py-32 space-y-4 text-blue-600">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="font-black uppercase tracking-[0.2em] text-xs">Stocking the shelves...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-blue-50/10 rounded-[2rem] border-2 border-dashed border-blue-100/30">
            <div className="bg-white p-6 rounded-full shadow-xl mb-6">
              <Package size={48} className="text-blue-200" />
            </div>
            <h3 className="text-2xl font-black text-blue-950 mb-2">Nothing found yet</h3>
            <p className="text-blue-900/40 font-medium max-w-sm">
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
