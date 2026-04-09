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
