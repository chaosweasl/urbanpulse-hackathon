"use client";

import { useState } from "react";
import { Plus, X, BrainCircuit, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkillTagListProps {
  initialTags: string[];
  onSave?: (tags: string[]) => Promise<void>;
  className?: string;
}

/**
 * Profile: SkillTagList — editable list of skill tags.
 * Allows adding and removing tags, with a blue/gold palette cohesive with the neighbor suite.
 */
export function SkillTagList({ initialTags, onSave, className }: SkillTagListProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addTag = () => {
    const value = input.trim().toLowerCase();
    if (!value || tags.includes(value)) {
      setInput("");
      return;
    }
    setTags((prev) => [...prev, value]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(tags);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={cn(
      "w-full max-w-md mx-auto border-2 border-blue-100/50 shadow-xl shadow-blue-900/5 bg-white rounded-3xl overflow-hidden",
      className
    )}>
      <CardHeader className="bg-blue-50/50 border-b border-blue-100/50 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
            <BrainCircuit className="text-white h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-black text-blue-950 tracking-tight">
            Your Skills & Expertise
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Input area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="e.g. Plumbing, Tutoring, Gardening..."
              className="bg-blue-50/20 border-blue-100/50 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium text-blue-950"
            />
            <Button
              onClick={addTag}
              disabled={!input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4"
            >
              <Plus size={18} />
            </Button>
          </div>
          <p className="text-[10px] text-blue-900/40 uppercase font-black tracking-widest px-1">
            Press Enter to add
          </p>
        </div>

        {/* Tags area */}
        <div className="flex flex-wrap gap-2 min-h-[100px] p-4 rounded-2xl bg-blue-50/10 border border-dashed border-blue-100/50">
          {tags.length === 0 ? (
            <p className="text-sm text-blue-900/30 italic m-auto">
              No skills listed yet...
            </p>
          ) : (
            tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-none px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-blue-50/30 border-t border-blue-100/50 p-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Saving Skills..." : "Save Skills"}
        </Button>
      </CardFooter>
    </Card>
  );
}
