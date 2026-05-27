import { cookies } from "next/headers";
import { dictionaries, Dictionary } from "./dictionaries";

export async function getDictionary(): Promise<Dictionary> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("flow_lang")?.value as "pt" | "en" | undefined;
  return dictionaries[lang || "pt"];
}
