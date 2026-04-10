import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const t = await getTranslations("HomePage");

  const features = [
    {
      title: t("features.pulse.title"),
      description: t("features.pulse.description")
    },
    {
      title: t("features.resource.title"),
      description: t("features.resource.description")
    },
    {
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

  const urgencyTones = ["bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-cyan-400"];

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="flex flex-col items-start justify-center min-h-[90vh] px-8 md:px-16 lg:px-24 w-full max-w-4xl self-start">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">
          {t("hero.badge")}
        </p>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.95] mb-8 text-foreground">
          {t("hero.title")}
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-xl mb-12 leading-relaxed">
          {t("hero.subtitle")}
        </p>
        <Link href="/register">
          <Button size="lg" className="h-14 px-10 rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90">
            {t("hero.ctaJoin")}
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="px-8 md:px-16 lg:px-24 py-24 w-full max-w-5xl self-start">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-16">
          {t("features.label")}
        </p>
        {features.map((f, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[120px_1fr_2fr] gap-8 items-start border-t border-border/30 py-10">
            <span className="text-[10px] font-black text-muted-foreground/40 tracking-widest">
              0{i + 1}
            </span>
            <h3 className="text-xl font-black tracking-tight text-foreground">{f.title}</h3>
            <p className="text-muted-foreground font-medium leading-relaxed">{f.description}</p>
          </div>
        ))}
      </section>

      {/* Live Preview Section */}
      <section className="relative w-full px-8 md:px-16 lg:px-24 pb-24 pt-8">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/90 to-transparent" />
        <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/50 bg-card/70 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-black/5">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">
                {t("preview.title")}
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
                Happening across the block
              </h2>
            </div>
            <span className="hidden md:inline-flex text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
              Live neighborhood snapshot
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {previewItems.map((item, index) => {
              const [locationLabel, description] = item.split(": ");

              return (
                <div
                  key={item}
                  className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/80 p-5 opacity-85 shadow-lg shadow-black/5 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/5" />
                  <div className="relative flex items-start gap-4">
                    <span className={`mt-2 size-2.5 rounded-full shadow-[0_0_16px_currentColor] ${urgencyTones[index % urgencyTones.length]}`} />
                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70">
                        {locationLabel}
                      </p>
                      <p className="text-base font-semibold leading-relaxed text-foreground/90">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="relative mt-8 flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-background/80 px-5 py-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Sign up to see your neighborhood →
            </p>
            <Link href="/register">
              <Button size="sm" className="h-10 rounded-xl bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90">
                Join the Pulse
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="w-full bg-card border-t border-border/50 py-32 px-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-8 text-foreground">
          Ready to know your neighbors?
        </h2>
        <Link href="/register">
          <Button size="lg" className="h-14 px-10 rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90">
            Join the Pulse
          </Button>
        </Link>
      </section>
    </main>
  );
}
