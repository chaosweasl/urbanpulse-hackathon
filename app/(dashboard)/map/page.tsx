"use client";

import { useState } from "react";
import { MapContainer } from "@/components/map/MapContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function MapPage() {
  const [filters, setFilters] = useState({
    category: "all",
    urgency: "all",
    showResources: true,
    showHeatmap: false,
  });

  const activeFilters = {
    category: filters.category === "all" ? undefined : filters.category,
    urgency: filters.urgency === "all" ? undefined : filters.urgency,
    showResources: filters.showResources,
    showHeatmap: filters.showHeatmap,
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Neighborhood Map</h1>
        <p className="text-muted-foreground">
          Visualize real-time pulses and available resources in your community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
              <CardDescription>Narrow down what you see</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-select">Category</Label>
                <Select
                  id="category-select"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="all">All Categories</option>
                  <option value="emergency">Emergency</option>
                  <option value="skill">Skills</option>
                  <option value="item">Items</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency-select">Urgency</Label>
                <Select
                  id="urgency-select"
                  value={filters.urgency}
                  onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                >
                  <option value="all">All Urgencies</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="show-resources">Show Resources</Label>
                <Switch
                  id="show-resources"
                  checked={filters.showResources}
                  onCheckedChange={(v: boolean) => setFilters({ ...filters, showResources: v })}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="show-heatmap">Density Heatmap</Label>
                <Switch
                  id="show-heatmap"
                  checked={filters.showHeatmap}
                  onCheckedChange={(v: boolean) => setFilters({ ...filters, showHeatmap: v })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm">Emergency Pulse</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm">Skill Request/Offer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">Item Request/Offer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                <span className="text-sm">Resource: Skill</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-sm">Resource: Item</span>
              </div>
              <div className="pt-2 text-xs text-muted-foreground">
                * Marker size indicates urgency level.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <MapContainer filters={activeFilters} />
        </div>
      </div>
    </div>
  );
}
