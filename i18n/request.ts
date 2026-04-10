import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

type Messages = Record<string, unknown>;
type SupportedLocale = "en" | "ro";

function isPlainObject(value: unknown): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMergeMessages(base: Messages, overrides: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, value] of Object.entries(overrides)) {
    const baseValue = result[key];

    if (isPlainObject(baseValue) && isPlainObject(value)) {
      result[key] = deepMergeMessages(baseValue, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

function normalizeLocale(localeValue?: string): SupportedLocale {
  return localeValue === "en" ? "en" : "ro";
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get("NEXT_LOCALE")?.value);
  const defaultMessages = (await import("../messages/en.json")).default as Messages;

  let localeMessages: Messages;

  try {
    localeMessages = (await import(`../messages/${locale}.json`)).default as Messages;
  } catch {
    localeMessages = {};
  }

  return {
    locale,
    messages: deepMergeMessages(defaultMessages, localeMessages),
  };
});
