"use client";

import { useEffect, useState } from "react";
import { PetReport } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";

interface PetMatchResultsProps {
  reportId: string;
  reportType: "lost" | "found";
}

interface MatchResult {
  id: string;
  confidence_score: number;
  matched_traits: string[];
  lost_report: (PetReport & { reporter: { id: string; username: string; avatar_url: string | null } }) | null;
  found_report: (PetReport & { reporter: { id: string; username: string; avatar_url: string | null } }) | null;
}

export function PetMatchResults({ reportId, reportType }: PetMatchResultsProps) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`/api/pets/match?report_id=${reportId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to fetch matches");
        setMatches(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMatches();
  }, [reportId]);

  const handleContact = async (recipientId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: recipientId }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        router.push(`/messages/${data.data.id}`);
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Searching for potential matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-900/40 bg-zinc-900 p-4 text-red-300">
        <AlertCircle className="mt-0.5" size={18} />
        <div className="text-sm font-medium">
          <p className="font-bold mb-1">Failed to load matches</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/20 bg-zinc-900 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-800">
          <AlertCircle className="text-primary h-8 w-8" />
        </div>
        <h4 className="text-lg font-bold mb-2">No matches found yet</h4>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We'll notify you automatically if we find a pet that matches this description. Our AI scans new reports constantly.
        </p>
      </div>
    );
  }

  const getMatchedReport = (match: MatchResult) => {
    if (reportType === 'lost') return match.found_report;
    return match.lost_report;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="text-green-500" size={20} />
        <h3 className="text-lg font-bold">Potential Matches ({matches.length})</h3>
      </div>

      {matches.map((match) => {
        const matchedReport = getMatchedReport(match);
        if (!matchedReport) return null;

        return (
          <Card key={match.id} className="overflow-hidden rounded-lg border border-white/8 bg-zinc-900">
            <CardContent className="p-0">
              <div className="border-b border-white/8 bg-zinc-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">AI Confidence Score</span>
                  <span className="text-sm font-bold">{match.confidence_score}%</span>
                </div>
                <Progress
                  value={match.confidence_score}
                  className={match.confidence_score > 70 ? "bg-green-100 [&>div]:bg-green-500" : match.confidence_score > 40 ? "bg-yellow-100 [&>div]:bg-yellow-500" : "bg-red-100 [&>div]:bg-red-500"}
                />
              </div>

              <div className="p-5 flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex items-center gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-white/8">
                    {matchedReport.photo_url ? (
                      <Image
                        src={matchedReport.photo_url}
                        alt="Match"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">No Photo</div>
                    )}
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2 bg-background font-bold">
                      {matchedReport.type === "lost" ? "LOST" : "FOUND"}
                    </Badge>
                    <p className="text-sm font-bold line-clamp-1">{matchedReport.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{matchedReport.breed} • {matchedReport.color}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(matchedReport.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Matched Traits</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {match.matched_traits.map((trait, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <AvatarWithBadge src={matchedReport.reporter.avatar_url} fallback={matchedReport.reporter.username} size="sm" />
                      <span className="text-xs font-medium">{matchedReport.reporter.username}</span>
                    </div>
                    <Button size="sm" onClick={() => handleContact(matchedReport.reporter.id)} className="rounded-lg font-bold">
                      <MessageCircle size={14} className="mr-1.5" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
