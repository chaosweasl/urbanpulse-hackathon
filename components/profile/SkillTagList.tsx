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
      "w-full max-w-md mx-auto bg-card border border-border/50 rounded-2xl overflow-hidden",
      className
    )}>
      <CardHeader className="bg-muted/30 border-b border-border/50 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2.5 rounded-xl">
            <BrainCircuit className="text-primary h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-black text-foreground tracking-tight">
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
              className="bg-muted/50 border-border/50 rounded-xl focus:ring-primary focus:border-primary font-medium text-foreground"
            />
            <Button
              onClick={addTag}
              disabled={!input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4"
            >
              <Plus size={18} />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest px-1">
            Press Enter to add
          </p>
        </div>

        {/* Tags area */}
        <div className="flex flex-wrap gap-2 min-h-[100px] p-4 rounded-xl bg-muted/20 border border-dashed border-border/50">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground/50 italic m-auto">
              No skills listed yet...
            </p>
          ) : (
            tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-muted hover:bg-muted/80 text-foreground border-none px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive transition-colors"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t border-border/50 p-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl transition-all active:scale-95 disabled:opacity-50"
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
