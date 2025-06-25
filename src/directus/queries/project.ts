import { readItems } from "@directus/sdk";
import directusClient from "../cli";






export async function getProject() {
  const project = directusClient.request(readItems('projects', {
    fields: ['*'],
    filter: {
      "status": { "_eq": "published" }
    },
  }))

  return project;
}
