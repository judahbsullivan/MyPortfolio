import { apiUrl } from '@/types/env'
import { createDirectus, rest, authentication } from '@directus/sdk';

const directusClient = createDirectus(apiUrl)
  .with(authentication())
  .with(rest());

export default directusClient;

