import { createManagementClient } from '@kontent-ai/management-sdk';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const packageJsonPath = join(import.meta.dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

const sourceTrackingHeaderName = 'X-KC-SOURCE';

/**
 * Creates a Kontent.ai Management API client
 * @param environmentId Optional environment ID (defaults to process.env.KONTENT_ENVIRONMENT_ID)
 * @param apiKey Optional API key (defaults to process.env.KONTENT_API_KEY)
 * @returns Management API client instance
 */
export const createMapiClient = (
  environmentId?: string,
  apiKey?: string
) => {
  return createManagementClient({
    apiKey: apiKey ?? process.env.KONTENT_API_KEY ?? throwError("KONTENT_API_KEY is not set"),
    environmentId: environmentId ?? process.env.KONTENT_ENVIRONMENT_ID ?? throwError("KONTENT_ENVIRONMENT_ID is not set"),
    headers: [{
      header: sourceTrackingHeaderName,
      value: `${packageJson.name};${packageJson.version}`,
    }],
  });
};

const throwError = (message: string) => {
  throw new Error(message);
};
