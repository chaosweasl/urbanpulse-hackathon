import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rss, Package, AlertTriangle } from "lucide-react";

export default async function Page() {
  const t = await getTranslations("HomePage");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <header className="flex flex-1 flex-col items-center justify-center px-6 text-center lg:px-24">
        <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary text-4xl font-black text-primary-foreground shadow-xl shadow-primary/20">
          U
        </div>
        <h1 className="mb-4 text-5xl font-black tracking-tight md:text-7xl">
          {t("title")}
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {t("description")}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-lg font-bold">
              {t("getStarted")}
            </Button>
          </Link>
          <Link href="/feed">
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg font-bold">
              <Rss className="mr-2" />
              {t("viewFeed")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Rss size={32} />
            </div>
            <h3 className="mb-2 text-xl font-bold">{t("feature1Title")}</h3>
            <p className="text-muted-foreground">{t("feature1Desc")}</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Package size={32} />
            </div>
            <h3 className="mb-2 text-xl font-bold">{t("feature2Title")}</h3>
            <p className="text-muted-foreground">{t("feature2Desc")}</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle size={32} />
            </div>
            <h3 className="mb-2 text-xl font-bold">{t("feature3Title")}</h3>
            <p className="text-muted-foreground">{t("feature3Desc")}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} UrbanPulse. All rights reserved.
      </footer>
    </div>
  );
}
