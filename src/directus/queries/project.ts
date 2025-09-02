import { readItems } from "@directus/sdk";
import directusClient from "../cli";






export async function getProject() {
  try {
    // Try to authenticate if token exists
    const token = import.meta.env.DIRECTUS_TOKEN;
    if (token) {
      await directusClient.login("token", token);
    }
    
    const projects = await directusClient.request(readItems('projects', {
      fields: ['*'],
      filter: {
        "status": { "_eq": "published" }
      },
      sort: ['-date_created']
    }));
    
    return projects;
  } catch (error) {
    // If authentication fails, try without auth (for public collections)
    try {
      const projects = await directusClient.request(readItems('projects', {
        fields: ['*'],
        filter: {
          "status": { "_eq": "published" }
        },
        sort: ['-date_created']
      }));
      
      return projects;
    } catch (fallbackError) {
      return [];
    }
  }
}
