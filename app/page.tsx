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
      <section className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-6 pb-16 pt-28 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
        <div className="space-y-8 animate-reveal-up">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
            <Sparkles className="h-3.5 w-3.5" />
            {t("hero.badge")}
          </div>

          <div className="space-y-5">
            <h1 className="text-5xl font-bold leading-[0.92] tracking-tight md:text-7xl lg:text-8xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/register">
              <Button size="lg" className="h-12 rounded-full px-8 text-sm font-semibold uppercase tracking-wide">
                {t("hero.ctaJoin")}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-sm font-semibold uppercase tracking-wide">
                {t("hero.ctaExplore")}
              </Button>
            </Link>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-3 pt-1">
            <div className="rounded-md border border-white/8 bg-zinc-900 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{t("hero.metrics.response")}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">2m</p>
            </div>
            <div className="rounded-md border border-white/8 bg-zinc-900 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{t("hero.metrics.coverage")}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">1km</p>
            </div>
            <div className="rounded-md border border-white/8 bg-zinc-900 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{t("hero.metrics.live")}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">24/7</p>
            </div>
          </div>
        </div>

        <div className="relative animate-reveal-up [animation-delay:120ms]">
          <div className="relative overflow-hidden rounded-lg border border-white/8 bg-zinc-900 p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{t("preview.title")}</p>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">{t("preview.deckTag")}</span>
            </div>

            <div className="space-y-3">
              {previewItems.map((item, index) => {
                const [locationLabel, ...rest] = item.split(": ");
                const description = rest.join(": ");

                return (
                  <div key={item} className="rounded-md border border-white/8 bg-zinc-900 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1.5 size-2.5 rounded-full ${urgencyTones[index % urgencyTones.length]}`} />
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{locationLabel}</p>
                        <p className="text-sm font-semibold leading-relaxed text-foreground/90">{description || item}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg border border-white/8 bg-zinc-900 px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground">{t("preview.logicLine")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 py-8 md:px-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{t("features.label")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 animate-reveal-up">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-lg border border-white/8 bg-zinc-900 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-lg bg-zinc-800 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
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
        <div className="mx-auto max-w-5xl rounded-lg border border-white/8 bg-zinc-900 px-8 py-14 text-center md:px-12 md:py-18">
          <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-muted-foreground md:text-base">
            {t("cta.subtitle")}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="h-12 rounded-full px-8 text-sm font-semibold uppercase tracking-wide">
                {t("hero.ctaJoin")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
