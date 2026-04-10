"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <div className={cn("w-24", className)}>
      <Select value={locale} onChange={handleLocaleChange}>
        <option value="ro">RO</option>
        <option value="en">EN</option>
      </Select>
    </div>
  );
}
