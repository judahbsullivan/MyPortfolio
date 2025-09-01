import { readItems } from "@directus/sdk";
import directusClient from "../cli";

/**
 * Generic utility to fetch items from a Directus collection.
 *
 * @param collection - The Directus collection name (e.g., "posts")
 * @param collection name (e.g., "posts")
 * @param limit - Number of items to return
 */
export async function getItems<T>(collection: string, limit?: number): Promise<T[]> {
  // Use appropriate sort field based on collection type
  const sortField = collection === 'projects' ? 'date_created' : 'published_at';

  const parsedLimit = typeof limit === 'number' && isFinite(limit) ? Math.max(0, Math.floor(limit)) : undefined;

  const requestOptions: any = {
    sort: [`-${sortField}`],
    filter: {
      status: { _eq: "published" }
    }
  };
 
  // Only include limit if it's a positive integer; otherwise fetch all
  if (parsedLimit && parsedLimit > 0) {
    requestOptions.limit = parsedLimit;
  }

  try {
    // Try to authenticate if token exists
    const token = import.meta.env.DIRECTUS_TOKEN;
    if (token) {
      await directusClient.login('token', token);
    }

    const items = await directusClient.request(
      readItems(collection as any, requestOptions)
    );

    return items as T[];
  } catch (error) {
    console.error(`Error fetching items from ${collection}:`, error);
    
    // If authentication fails, try without auth (for public collections)
    try {
      const items = await directusClient.request(
        readItems(collection as any, requestOptions)
      );
      return items as T[];
    } catch (fallbackError) {
      console.error(`Fallback fetch failed for ${collection}:`, fallbackError);
      return [];
    }
  }
}

