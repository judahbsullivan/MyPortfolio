import { readItems } from "@directus/sdk"
import directusClient from "../cli"






export async function getArticles() {
  try {
    // Try to authenticate if token exists
    const token = import.meta.env.DIRECTUS_TOKEN;
    if (token) {
      await directusClient.login("token", token);
    }
    
    const articles = await directusClient.request(readItems('posts', {
      fields: ['*'],
      filter: {
        "status": { "_eq": "published" }
      },
      sort: ['-published_at']
    }));
    
    return articles;
  } catch (error) {
    // If authentication fails, try without auth (for public collections)
    try {
      const articles = await directusClient.request(readItems('posts', {
        fields: ['*'],
        filter: {
          "status": { "_eq": "published" }
        },
        sort: ['-published_at']
      }));
      
      return articles;
    } catch (fallbackError) {
      return [];
    }
  }
}
