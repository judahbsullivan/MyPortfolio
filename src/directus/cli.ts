import { apiUrl } from '@/types/env'
import { createDirectus, rest } from '@directus/sdk';

const directusClient = createDirectus(apiUrl).with(rest());

export default directusClient;

