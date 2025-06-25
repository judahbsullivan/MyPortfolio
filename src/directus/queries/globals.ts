import { readItem, readItems } from "@directus/sdk";
import directusClient from "../cli";
import { getItems } from "./utils";






export async function getNavigationItems(nav: "main" | "footer" = "main") {
  return directusClient.request(
    readItem(
      "navigation",
      nav,
      {
        fields: [
          {
            items: [
              "*",
              { page: ["permalink"] },
              {
                children: [
                  "*",
                  { page: ["permalink"] },
                  { children: ["*", { section: ['*'] }, { page: ["permalink"] }] },
                ],
              },
            ],
          },
        ],
      },
    )
  );
}
