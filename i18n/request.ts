import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Try reading the locale from a cookie
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ro"; // Default to Romanian

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
