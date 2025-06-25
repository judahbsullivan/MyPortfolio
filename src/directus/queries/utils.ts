import { readItems } from "@directus/sdk";
import directusClient from "../cli";

/**
 * Generic utility to fetch items from a Directus collection.
 *
 * @param collection - The Directus collection name (e.g., "posts")
 * @param limit - Number of items to return
 */
export async function getItems<T>(collection: string, limit: number): Promise<T[]> {

  const sortField = collection === 'projects'
    ? 'published_At'
    : 'date_created';
  const items = await directusClient.request(
    readItems(collection as any, {
      limit,
      sort: [`-${sortField}`], // sort newest first, optional
      filter: {
        // status: { _eq: "published" } // optional: skip if no status field
      }
    })
  );

  return items as T[];
}

