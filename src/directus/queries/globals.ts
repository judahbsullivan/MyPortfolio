import { readItem, readItems } from "@directus/sdk";
import directusClient from "../cli";
import { getItems } from "./utils";
import type { Globals } from "@/types/directusCollection";

export async function getNavigationItems(nav: "main" | "footer" = "main") {
  return directusClient.request(
    readItem("navigation", nav, {
      fields: [
        {
          items: [
            "*",
            { page: ["permalink"] },
            {
              children: [
                "*",
                { page: ["permalink"] },
                {
                  children: ["*", { section: ["*"] }, { page: ["permalink"] }],
                },
              ],
            },
          ],
        },
      ],
    }),
  );
}

export async function getGlobals() {
  return directusClient.request(
    readItems("globals", {
      fields: ["*", "favicon.*", "logo.*", "logo_dark_mode.*"],
    }),
  );
}
