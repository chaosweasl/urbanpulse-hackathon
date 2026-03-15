import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("HomePage");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-9xl font-black text-foreground">{t("meow")}</h1>
    </div>
  );
}
