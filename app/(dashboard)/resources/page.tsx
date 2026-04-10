"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/shared/SearchBar";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource } from "@/types";
import { useTranslations } from "next-intl";

interface ResourceWithOwner extends Resource {
  owner: {
    id: string;
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
  const t = useTranslations("ResourcesPage");
  const [resources, setResources] = useState<ResourceWithOwner[]>([]);
  const [filteredResources, setFilteredResources] = useState<ResourceWithOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "item" | "skill">("all");
  const router = useRouter();

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
    const resource = filteredResources.find((res) => res.id === id);
    if (!resource) return;

    const startConversation = async () => {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipient_id: resource.owner.id, resource_id: id }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          router.push(`/messages/${data.data.id}`);
        }
      } catch (err) {
        console.error("Failed to start conversation:", err);
      }
    };

    startConversation();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Branded Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">
            {t("badge")}
          </p>
          <h1 className="mb-3 text-3xl font-bold leading-none tracking-tight md:text-4xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground font-medium max-w-lg">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex shrink-0 rounded-lg border border-white/8 bg-zinc-900 p-1">
          {(["all", "item", "skill"] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={cn(
                "rounded-lg px-5 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? t("filters.all") : f === "item" ? t("filters.tools") : t("filters.skills")}
            </button>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto px-4">
        <SearchBar
          placeholder={t("searchPlaceholder")}
          onSearch={handleSearch}
          className="w-full"
        />
      </div>

      {/* Main Grid */}
      <div className="px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[240px] rounded-lg border border-white/8 bg-zinc-900 animate-pulse sm:h-[300px] xl:h-[320px]" />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-zinc-900 py-32 text-center">
            <div className="mb-6 rounded-lg bg-zinc-800 p-6">
              <Package size={48} className="text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-foreground">{t("emptyTitle")}</h3>
            <p className="text-muted-foreground font-medium max-w-sm">
              {t("emptyDescription")}
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
