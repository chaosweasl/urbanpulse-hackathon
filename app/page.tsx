import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Map, Sparkles, MessageCircle, Package, ArrowRight } from "lucide-react";

export default async function LandingPage() {
  const t = await getTranslations("HomePage");

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden pb-24">
      {/* Tidal Background Gradient Orb */}
      <div className="fixed -top-40 -left-40 size-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="fixed top-1/2 -right-40 size-96 rounded-full bg-accent/10 blur-[120px]" />

      {/* Hero Section */}
      <section className="relative flex w-full max-w-6xl flex-col items-center justify-center px-6 pt-32 text-center md:pt-48">
        <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
           <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase">
            <Sparkles className="size-3" />
            {t("hero.badge")}
          </div>
          <h1 className="mb-6 text-5xl font-black leading-[1.1] md:text-8xl tracking-tight">
            {t("hero.title")}
          </h1>
          <p className="mb-10 max-w-2xl text-lg font-medium text-muted-foreground md:text-2xl leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="h-14 rounded-2xl px-8 text-lg font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground">
                {t("hero.ctaJoin")}
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="outline" className="h-14 rounded-2xl border-border/50 bg-background/50 px-8 text-lg font-bold backdrop-blur-md transition-all hover:bg-muted/50">
                <Map className="mr-2 size-5" />
                {t("hero.ctaExplore")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Preview (Scrolling Marquee) */}
      <section className="mt-32 w-full max-w-6xl overflow-hidden px-6">
        <h2 className="mb-8 text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {t("preview.title")}
        </h2>
        <div className="flex animate-marquee gap-6 whitespace-nowrap py-4">
          {[1, 2, 3, 4, 1, 2, 3, 4].map((i, idx) => (
            <div key={idx} className="glass flex items-center gap-3 rounded-2xl px-6 py-4 font-bold text-foreground">
              <Activity className="size-4 text-primary" />
              {t(`preview.item${i}`)}
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mt-32 grid w-full max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
        <Card className="glass group relative overflow-hidden border-none transition-all hover:scale-[1.02]">
          <CardContent className="p-8 pt-10">
            <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Activity className="size-8" />
            </div>
            <h3 className="mb-3 text-2xl font-black">{t("features.pulse.title")}</h3>
            <p className="text-muted-foreground font-medium leading-relaxed">
              {t("features.pulse.description")}
            </p>
          </CardContent>
        </Card>

        <Card className="glass group relative overflow-hidden border-none transition-all hover:scale-[1.02]">
          <CardContent className="p-8 pt-10">
            <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Package className="size-8" />
            </div>
            <h3 className="mb-3 text-2xl font-black">{t("features.resource.title")}</h3>
            <p className="text-muted-foreground font-medium leading-relaxed">
              {t("features.resource.description")}
            </p>
          </CardContent>
        </Card>

        <Card className="glass group relative overflow-hidden border-none transition-all hover:scale-[1.02]">
          <CardContent className="p-8 pt-10">
            <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-8" />
            </div>
            <h3 className="mb-3 text-2xl font-black">{t("features.heroMatching.title")}</h3>
            <p className="text-muted-foreground font-medium leading-relaxed">
              {t("features.heroMatching.description")}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Mobile-Only CTA (Visual Polish) */}
      <div className="fixed bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary/10 px-6 py-2 text-sm font-bold text-primary backdrop-blur-md md:hidden">
        <Activity className="size-4" />
        {t("preview.item1")}
      </div>
    </main>
  );
}
