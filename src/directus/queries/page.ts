import { readItems } from "@directus/sdk"
import directusClient from "../cli"





export async function getPages() {
  const pages = directusClient.request(
    readItems('pages', {
      fields: [
        '*',
        {
          user_created: ["*"],
          blocks: ["*.*.*.*",]
        }
      ],
    })
  )
  return pages
}

