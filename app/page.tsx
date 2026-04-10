import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Radar, ShieldCheck, Sparkles, Waves } from "lucide-react";

export default async function LandingPage() {
  const t = await getTranslations("HomePage");

  const features = [
    {
      icon: Radar,
      title: t("features.pulse.title"),
      description: t("features.pulse.description")
    },
    {
      icon: Waves,
      title: t("features.resource.title"),
      description: t("features.resource.description")
    },
    {
      icon: ShieldCheck,
      title: t("features.heroMatching.title"),
      description: t("features.heroMatching.description")
    }
  ];

  const previewItems = [
    t("preview.item1"),
    t("preview.item2"),
    t("preview.item3"),
    t("preview.item4"),
  ];

  const urgencyTones = ["bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-cyan-400", "bg-lime-400", "bg-sky-400"];
  const marqueeItems = [...previewItems, ...previewItems, ...previewItems];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,hsl(var(--primary)/0.2),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(120,160,255,0.14),transparent_34%)]" />

      <section className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-6 pb-16 pt-28 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
        <div className="space-y-8 animate-reveal-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {t("hero.badge")}
          </div>

          <div className="space-y-5">
            <h1 className="text-5xl font-black leading-[0.92] tracking-tighter md:text-7xl lg:text-8xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/register">
              <Button size="lg" className="h-14 rounded-full px-8 text-sm font-black uppercase tracking-[0.12em]">
                {t("hero.ctaJoin")}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-sm font-black uppercase tracking-[0.12em]">
                {t("hero.ctaExplore")}
              </Button>
            </Link>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-3 pt-1">
            <div className="rounded-2xl bg-neutral-900/75 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Response</p>
              <p className="mt-1 text-2xl font-black tracking-tight">2m</p>
            </div>
            <div className="rounded-2xl bg-neutral-900/75 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Coverage</p>
              <p className="mt-1 text-2xl font-black tracking-tight">1km</p>
            </div>
            <div className="rounded-2xl bg-neutral-900/75 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Live</p>
              <p className="mt-1 text-2xl font-black tracking-tight">24/7</p>
            </div>
          </div>
        </div>

        <div className="relative animate-reveal-up [animation-delay:120ms]">
          <div className="pointer-events-none absolute -right-3 -top-3 h-32 w-32 rounded-full bg-primary/25 blur-3xl animate-drift-slow" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)] md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t("preview.title")}</p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground">Live deck</span>
            </div>

            <div className="space-y-3">
              {previewItems.map((item, index) => {
                const [locationLabel, ...rest] = item.split(": ");
                const description = rest.join(": ");

                return (
                  <div key={item} className="rounded-2xl bg-neutral-900/80 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1.5 size-2.5 rounded-full shadow-[0_0_16px_currentColor] ${urgencyTones[index % urgencyTones.length]}`} />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">{locationLabel}</p>
                        <p className="text-sm font-semibold leading-relaxed text-foreground/90">{description || item}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground">Smart alerts route urgency to the nearest verified neighbors.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 py-8 md:px-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t("features.label")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-[1.75rem] bg-neutral-900/75 p-6 animate-reveal-up" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-black tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden py-10">
        <div className="animate-marquee flex min-w-[200%] gap-4">
          {marqueeItems.map((item, index) => (
            <div key={`${item}-${index}`} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-neutral-900 px-4 py-2">
              <span className={`size-2 rounded-full ${urgencyTones[index % urgencyTones.length]}`} />
              <span className="text-xs font-semibold text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative px-6 pb-24 pt-8 md:px-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.35),transparent_45%),linear-gradient(135deg,#0b0d14,#08090c_55%,#111927)] px-8 py-14 text-center md:px-12 md:py-18">
          <h2 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tighter md:text-6xl">
            Ready to know your neighbors?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-muted-foreground md:text-base">
            Turn your block into a living support network with real-time awareness and trusted local action.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="h-14 rounded-full px-8 text-sm font-black uppercase tracking-[0.12em]">
                Join the Pulse
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
