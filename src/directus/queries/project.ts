import { readItems } from "@directus/sdk";
import directusClient from "../cli";






export async function getProject() {
  const projects = await directusClient.request(readItems('projects', {
    fields: ['*'],
    filter: {
      "status": { "_eq": "published" }
    },
    sort: ['-date_created']
  }));
  return projects;
}
