"use client";

import { useState, useEffect } from "react";
import { PetReport } from "@/types";
import { PetCard } from "@/components/pets/PetCard";
import { PetForm } from "@/components/pets/PetForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Cat, Dog, Bird, Info } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function PetsDashboard() {
  const [pets, setPets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchPets() {
      setIsLoading(true);
      try {
        let url = `/api/pets?status=active`;
        if (typeFilter !== "all") url += `&type=${typeFilter}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.success && data.data) {
          let filteredPets = data.data;
          if (speciesFilter !== "all") {
            filteredPets = filteredPets.filter((p: any) => p.species === speciesFilter);
          }
          setPets(filteredPets);
        }
      } catch (err) {
        console.error("Failed to fetch pets", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPets();
  }, [typeFilter, speciesFilter]);

  const speciesIcons: Record<string, React.ReactNode> = {
    all: <Search size={16} />,
    dog: <Dog size={16} />,
    cat: <Cat size={16} />,
    bird: <Bird size={16} />,
    other: <Info size={16} />
  };

  return (
    <div className="mx-auto w-full max-w-6xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Lost & Found Pets</h1>
          <p className="text-muted-foreground font-medium text-lg">
            Help reunite pets with their families using AI-powered matching.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 w-full rounded-lg px-6 text-base font-bold md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Report a Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-lg border border-white/8 bg-zinc-900 p-0 sm:max-w-xl">
            <DialogHeader className="border-b border-white/8 bg-zinc-800 p-6 pb-2">
              <DialogTitle className="text-2xl font-bold">Report a Lost or Found Pet</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <PetForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-white/8 bg-zinc-900 p-4 md:flex-row md:items-center">
        <Tabs value={typeFilter} onValueChange={setTypeFilter} className="w-full md:w-auto">
          <TabsList className="grid h-12 w-full grid-cols-3 rounded-lg bg-zinc-800 p-1">
            <TabsTrigger value="all" className="rounded-lg font-bold">All</TabsTrigger>
            <TabsTrigger value="lost" className="rounded-lg font-bold data-[state=active]:bg-red-500 data-[state=active]:text-white">Lost</TabsTrigger>
            <TabsTrigger value="found" className="rounded-lg font-bold data-[state=active]:bg-green-500 data-[state=active]:text-white">Found</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          {["all", "dog", "cat", "bird", "other"].map(species => (
            <Button
              key={species}
              variant={speciesFilter === species ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeciesFilter(species)}
              className="h-10 rounded-lg font-bold capitalize"
            >
              {speciesIcons[species]}
              <span className="ml-2">{species}</span>
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[260px] rounded-lg border border-white/8 bg-zinc-900 animate-pulse sm:h-[320px] lg:h-[350px]" />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No pets found"
          description={`We couldn't find any ${typeFilter !== 'all' ? typeFilter : ''} pets matching your current filters.`}
          action={
            <Button onClick={() => { setTypeFilter("all"); setSpeciesFilter("all"); }} variant="outline" className="rounded-lg">
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} report={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
