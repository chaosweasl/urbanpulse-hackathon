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
      "mx-auto w-full max-w-md overflow-hidden rounded-lg border border-white/8 bg-zinc-900",
      className
    )}>
      <CardHeader className="border-b border-white/8 bg-zinc-800 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-2.5">
            <BrainCircuit className="text-primary h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Your Skills & Expertise
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {onSave && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="e.g. Plumbing, Tutoring, Gardening..."
                className="rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
              />
              <Button
                onClick={addTag}
                disabled={!input.trim()}
                className="rounded-lg bg-primary px-4 text-primary-foreground hover:bg-primary/90"
              >
                <Plus size={18} />
              </Button>
            </div>
            <p className="px-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Press Enter to add
            </p>
          </div>
        )}

        {/* Tags area */}
        <div className="flex min-h-[100px] flex-wrap gap-2 rounded-lg border border-dashed border-white/20 bg-zinc-800 p-4">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground/50 italic m-auto">
              No skills listed yet...
            </p>
          ) : (
            tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-2 rounded-lg border-none bg-zinc-700 px-3 py-1.5 font-bold text-foreground transition-colors hover:bg-zinc-600"
              >
                {tag}
                {onSave && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </Badge>
            ))
          )}
        </div>
      </CardContent>

      {onSave && (
        <CardFooter className="border-t border-white/8 bg-zinc-800 p-6">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 w-full rounded-lg bg-primary font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Saving Skills..." : "Save Skills"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
