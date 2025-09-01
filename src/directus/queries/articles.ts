import { readItems } from "@directus/sdk"
import directusClient from "../cli"






export async function getArticles() {
  const articles = await directusClient.request(readItems('posts', {
    fields: ['*'],
    filter: {
      "status": { "_eq": "published" }
    },
    sort: ['-published_at']
  }));
  return articles;
}
