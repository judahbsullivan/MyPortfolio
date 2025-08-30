import { readItems } from "@directus/sdk";
import directusClient from "../cli";

/**
 * Generic utility to fetch items from a Directus collection.
 *
 * @param collection - The Directus collection name (e.g., "posts")
 * @param limit - Number of items to return
 */
export async function getItems<T>(collection: string, limit?: number): Promise<T[]> {
  const sortField = collection === 'projects'
    ? 'published_At'
    : 'date_created';

  const parsedLimit = typeof limit === 'number' && isFinite(limit) ? Math.max(0, Math.floor(limit)) : undefined;

  const requestOptions: any = {
    sort: [`-${sortField}`],
    filter: {
      // status: { _eq: "published" }
    }
  };

  // Only include limit if it's a positive integer; otherwise fetch all
  if (parsedLimit && parsedLimit > 0) {
    requestOptions.limit = parsedLimit;
  }

  const items = await directusClient.request(
    readItems(collection as any, requestOptions)
  );

  return items as T[];
}

