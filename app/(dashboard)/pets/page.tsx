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
    <div className="container max-w-6xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Lost & Found Pets</h1>
          <p className="text-muted-foreground font-medium text-lg">
            Help reunite pets with their families using AI-powered matching.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl shadow-lg h-12 px-6 font-bold text-base w-full md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Report a Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-0 glass">
            <DialogHeader className="p-6 pb-2 border-b border-border/50 bg-muted/20">
              <DialogTitle className="text-2xl font-black">Report a Lost or Found Pet</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <PetForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/10 p-4 rounded-3xl border border-border/50">
        <Tabs value={typeFilter} onValueChange={setTypeFilter} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/30 rounded-2xl">
            <TabsTrigger value="all" className="rounded-xl font-bold data-[state=active]:shadow-sm">All</TabsTrigger>
            <TabsTrigger value="lost" className="rounded-xl font-bold data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-sm">Lost</TabsTrigger>
            <TabsTrigger value="found" className="rounded-xl font-bold data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm">Found</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          {["all", "dog", "cat", "bird", "other"].map(species => (
            <Button
              key={species}
              variant={speciesFilter === species ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeciesFilter(species)}
              className="rounded-xl font-bold capitalize h-10"
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
            <div key={i} className="h-[350px] rounded-3xl border border-border/50 bg-muted/20 animate-pulse glass" />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No pets found"
          description={`We couldn't find any ${typeFilter !== 'all' ? typeFilter : ''} pets matching your current filters.`}
          action={
            <Button onClick={() => { setTypeFilter("all"); setSpeciesFilter("all"); }} variant="outline" className="rounded-xl">
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
