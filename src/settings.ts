import dotenvDefaults from 'dotenv-defaults';
import Settings from "@/types/settings";

dotenvDefaults.config();
const APP_ENVIRONMENT_PREFIX = "ECOMMERCE_";
const envs = getEnvironmentVariables();

export default {
  ENV: envs.ENV as Settings['ENV'],
  PORT: parseInt(envs.PORT) as Settings['PORT'],
} as Settings;

/******************************************************************************
 * Utils
 */


function getEnvironmentVariables(): {[key: string]: string} {
  return Object.fromEntries(
    Object.entries(process.env)
      .filter(([key, value]) => key.startsWith(APP_ENVIRONMENT_PREFIX) || value === undefined)
      .map(([key, value]) => [key.slice(APP_ENVIRONMENT_PREFIX.length), value])
  ) as {[key: string]: string};
}