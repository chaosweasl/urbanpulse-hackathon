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
      setError("Failed to add resource. Please try again.");
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
      setError("Failed to update status.");
    }
  };

  const handleRemove = async (id: string) => {
    if (!onRemove) return;
    try {
      await onRemove(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Remove resource error:", err);
      setError("Failed to remove resource.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-blue-100/50 shadow-xl shadow-blue-900/5 bg-white rounded-3xl overflow-hidden">
      <CardHeader className="bg-blue-50/50 border-b border-blue-100/50 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
              <Package className="text-white h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-black text-blue-950 tracking-tight">
              Your Shared Resources
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAdding(!isAdding)}
            className={cn(
              "rounded-xl transition-all",
              isAdding ? "bg-red-50 text-red-600 rotate-45" : "bg-blue-100 text-blue-600"
            )}
          >
            <Plus size={20} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Add Resource Form */}
        {isAdding && (
          <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-blue-50/30 border border-blue-100/20 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resource-name" className="text-xs font-bold text-blue-950 px-1">Resource Name</Label>
                <Input
                  id="resource-name"
                  placeholder="e.g. Electric Drill, Cooking Class"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-white border-blue-100/50 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium text-blue-950"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-type" className="text-xs font-bold text-blue-950 px-1">Type</Label>
                <Select
                  id="resource-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ResourceType)}
                  className="bg-white border-blue-100/50 rounded-xl font-medium text-blue-950"
                >
                  <option value="item">Physical Item</option>
                  <option value="skill">Helpful Skill</option>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !newName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-600/10"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Plus className="mr-2" size={16} />}
              Add to Community
            </Button>
          </form>
        )}

        {/* Resource List */}
        <div className="space-y-3">
          {resources.length === 0 && !isAdding && (
            <div className="py-12 text-center space-y-2">
              <p className="text-blue-900/40 font-black text-[10px] uppercase tracking-widest">No resources yet</p>
              <p className="text-blue-950/60 text-sm font-medium">Start by adding an item or skill you can share.</p>
            </div>
          )}

          {resources.map((resource) => (
            <div
              key={resource.id}
              className={cn(
                "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
                resource.status === "available"
                  ? "bg-white border-blue-100/30 hover:border-blue-200 hover:shadow-md"
                  : "bg-gray-50/50 border-gray-100 opacity-70 grayscale"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl shadow-sm",
                  resource.type === "item" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                )}>
                  {resource.type === "item" ? <Package size={18} /> : <Wrench size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-blue-950 leading-none mb-1.5">{resource.name}</h4>
                  <Badge
                      variant="outline"
                    className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-1.5 h-auto border-none",
                      resource.status === "available" ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {resource.status === "available" ? "Ready to Share" : "Not Available"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggle(resource.id, resource.status)}
                  className={cn(
                    "h-9 rounded-xl font-bold text-xs px-3 transition-colors",
                    resource.status === "available"
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  )}
                >
                  {resource.status === "available" ? <X size={14} className="mr-1.5" /> : <Check size={14} className="mr-1.5" />}
                  {resource.status === "available" ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(resource.id)}
                  className="h-9 w-9 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
