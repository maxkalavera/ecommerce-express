import dotenvDefaults from 'dotenv-defaults';
import Settings from "@/types/settings";
import path from 'node:path';

dotenvDefaults.config();
const APP_ENVIRONMENT_PREFIX = "ECOMMERCE_";
const envs = getEnvironmentVariables();

export default {
  ENV: envs.ENV as Settings['ENV'],
  PORT: parseInt(envs.PORT) as Settings['PORT'],
  DB: {
    URL: `postgresql://${envs.POSTGRES_USER}:${envs.POSTGRES_PASSWORD}@${envs.POSTGRES_HOST}:${envs.POSTGRES_PORT}/${envs.POSTGRES_DB}`,
    HOST: envs.POSTGRES_HOST,
    NAME: envs.POSTGRES_DB,
    PORT: parseInt(envs.POSTGRES_PORT),
    USER: envs.POSTGRES_USER,
    PASSWORD: envs.POSTGRES_PASSWORD,
  },
  RUNTIME_FOLDER: path.resolve(process.cwd(), ".runtime"),
  DEV_DATA_FOLDER: path.resolve(process.cwd(), ".runtime/data"),
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