"use client";

import { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
  showFilter?: boolean;
  onFilterClick?: () => void;
}

/**
 * Shared: SearchBar — universal search input with debounce.
 * Features a search icon, debounced onChange, and a clear button.
 * Cohesive with the HeroAlert blue/gold palette.
 */
export function SearchBar({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  className,
  showFilter = false,
  onFilterClick,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  // Handle debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-900/30 group-focus-within:text-blue-600 transition-colors" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "pl-12 pr-12 h-14 bg-white/80 border-2 border-blue-100/50 rounded-2xl shadow-sm",
            "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400/50 transition-all",
            "placeholder:text-blue-900/20 text-blue-950 font-medium"
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-blue-50 text-blue-900/40 hover:text-blue-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showFilter && (
        <Button
          variant="outline"
          size="icon"
          onClick={onFilterClick}
          className="h-14 w-14 rounded-2xl border-2 border-blue-100/50 bg-white hover:bg-blue-50 hover:border-blue-200 text-blue-600 shadow-sm transition-all active:scale-95"
        >
          <Filter size={20} />
        </Button>
      )}
    </div>
  );
}
