"use client";

import { useState } from "react";
import {
  Package,
  Wrench,
  Trash2,
  Plus,
  Check,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Resource, ResourceType, ResourceStatus } from "@/types";
import { useTranslations } from "next-intl";

interface ResourceListProps {
  initialResources: Resource[];
  onAdd?: (resource: Omit<Resource, "id" | "created_at" | "updated_at" | "owner_id">) => Promise<Resource | void>;
  onToggleStatus?: (id: string, newStatus: ResourceStatus) => Promise<Resource | void>;
  onRemove?: (id: string) => Promise<void>;
}

/**
 * Profile: ResourceList — items the user is willing to lend.
 * Displays a list of resources (items/skills) with availability toggles and removal actions.
 * Cohesive with the HeroAlert blue/gold palette and neighbor suite design.
 */
export function ResourceList({
  initialResources,
  onAdd,
  onToggleStatus,
  onRemove,
}: ResourceListProps) {
  const t = useTranslations("ProfileResources");
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Resource Form State
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<ResourceType>("item");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !onAdd) return;

    setIsLoading(true);
    setError(null);
    try {
      const added = await onAdd({
        name: newName.trim(),
        type: newType,
        description: "",
        tags: [],
        status: "available",
        location: null,
      });

      if (added) {
        setResources((prev) => [added, ...prev]);
      }
      setNewName("");
      setIsAdding(false);
    } catch (err) {
      console.error("Add resource error:", err);
      setError(t("errors.add"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: ResourceStatus) => {
    if (!onToggleStatus) return;
    const newStatus: ResourceStatus = currentStatus === "available" ? "unavailable" : "available";

    try {
      const updated = await onToggleStatus(id, newStatus);
      if (updated) {
        setResources((prev) =>
          prev.map((r) => (r.id === id ? updated : r))
        );
      }
    } catch (err) {
      console.error("Toggle resource error:", err);
      setError(t("errors.update"));
    }
  };

  const handleRemove = async (id: string) => {
    if (!onRemove) return;
    try {
      await onRemove(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Remove resource error:", err);
      setError(t("errors.remove"));
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg border border-white/8 bg-zinc-900">
      <CardHeader className="border-b border-white/8 bg-zinc-800 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-2.5">
              <Package className="text-primary h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              {t("title")}
            </CardTitle>
          </div>
          {onAdd && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAdding(!isAdding)}
              className={cn(
                "rounded-lg text-foreground transition-colors hover:bg-zinc-700/60",
                isAdding && "rotate-45 text-destructive"
              )}
            >
              <Plus size={20} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Add Resource Form */}
        {isAdding && onAdd && (
          <form onSubmit={handleAdd} className="space-y-4 rounded-lg border border-white/8 bg-zinc-800 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resource-name" className="text-xs font-bold text-foreground px-1">Resource Name</Label>
                <Input
                  id="resource-name"
                  placeholder={t("namePlaceholder")}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-type" className="text-xs font-bold text-foreground px-1">{t("typeLabel")}</Label>
                <Select
                  id="resource-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ResourceType)}
                  className="rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground"
                >
                  <option value="item">{t("itemType")}</option>
                  <option value="skill">{t("skillType")}</option>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !newName.trim()}
              className="h-11 w-full rounded-lg bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Plus className="mr-2" size={16} />}
              {t("addButton")}
            </Button>
          </form>
        )}

        {/* Resource List */}
        <div className="space-y-3">
          {resources.length === 0 && !isAdding && (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{t("emptyTitle")}</p>
              <p className="text-muted-foreground text-sm font-medium">{t("emptyDescription")}</p>
            </div>
          )}

          {resources.map((resource) => (
            <div
              key={resource.id}
              className={cn(
                "group flex items-center justify-between rounded-lg border p-4 transition-all duration-200",
                resource.status === "available"
                  ? "border-white/8 bg-zinc-900 hover:border-white/20"
                  : "border-white/8 bg-zinc-800 opacity-70 grayscale"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-lg shadow-sm",
                  resource.type === "item" ? "bg-amber-500/20 text-amber-500" : "bg-primary/20 text-primary"
                )}>
                  {resource.type === "item" ? <Package size={18} /> : <Wrench size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-foreground leading-none mb-1.5">{resource.name}</h4>
                  <Badge
                      variant="outline"
                    className={cn(
                        "h-auto px-1.5 text-[9px] font-medium uppercase tracking-wider border-none",
                      resource.status === "available" ? "text-emerald-500" : "text-rose-500"
                    )}
                  >
                    {resource.status === "available" ? t("status.ready") : t("status.unavailable")}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onToggleStatus && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggle(resource.id, resource.status)}
                    className={cn(
                      "h-9 rounded-lg font-bold text-xs px-3 transition-colors",
                      resource.status === "available"
                        ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
                        : "bg-primary/20 text-primary hover:bg-primary/30"
                    )}
                  >
                    {resource.status === "available" ? <X size={14} className="mr-1.5" /> : <Check size={14} className="mr-1.5" />}
                    {resource.status === "available" ? t("actions.deactivate") : t("actions.activate")}
                  </Button>
                )}
                {onRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(resource.id)}
                    className="h-9 w-9 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
