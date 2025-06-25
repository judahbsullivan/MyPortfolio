import { readItems } from "@directus/sdk"
import directusClient from "../cli"






export async function getArticles() {
  const articles = directusClient.request(readItems('posts', {
    fields: ['*'],
  }))
  return articles;
}
