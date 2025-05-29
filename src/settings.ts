import dotenvDefaults from 'dotenv-defaults';
import path from 'node:path';

/******************************************************************************
 * Types
 *****************************************************************************/

export type Settings = {
  ENV: "production" | "development",
  PORT: number;
  DB: {
    URL: string;
    HOST: string;
    NAME: string;
    PORT: number;
    USER: string;
    PASSWORD: string;
  },
  RUNTIME_FOLDER: string;
  DEV_DATA_FOLDER: string;
  QUERIES_LOOK_UP_ATTRIBUTE: string;
  SECRET_KEY: string;
  PAGINATION_DEFAULT_LIMIT: number;
};

/******************************************************************************
 * Settings
 *****************************************************************************/

dotenvDefaults.config();
const APP_ENVIRONMENT_PREFIX = "ECOMMERCE_";
const envs = getEnvironmentVariables();

const initials: Settings = {
  ENV: "development",
  PORT: 3001,
  DB: { URL: "", HOST: "", NAME: "", PORT: 3001, USER: "", PASSWORD: "" },
  RUNTIME_FOLDER: path.resolve(process.cwd(), ".runtime"),
  DEV_DATA_FOLDER: path.resolve(process.cwd(), ".runtime/data"),
  QUERIES_LOOK_UP_ATTRIBUTE: "id",
  SECRET_KEY: "",
  PAGINATION_DEFAULT_LIMIT: 20,
};

const fromEnvSettings: Partial<Settings> = {
  ENV: envs.ENV as Settings['ENV'],
  PORT: safeParseInt(envs.PORT, initials.PORT),
  DB: {
    URL: `postgresql://${envs.POSTGRES_USER}:${envs.POSTGRES_PASSWORD}@${envs.POSTGRES_HOST}:${envs.POSTGRES_PORT}/${envs.POSTGRES_DB}`,
    HOST: envs.POSTGRES_HOST,
    NAME: envs.POSTGRES_DB,
    PORT: safeParseInt(envs.POSTGRES_PORT, initials.DB.PORT),
    USER: envs.POSTGRES_USER,
    PASSWORD: envs.POSTGRES_PASSWORD,
  },
  SECRET_KEY: envs.SECRET_KEY,
  PAGINATION_DEFAULT_LIMIT: safeParseInt(envs.PAGINATION_DEFAULT_LIMIT, initials.PAGINATION_DEFAULT_LIMIT),
};

export default Object.assign(
  initials,
  fromEnvSettings
) as Settings;

/******************************************************************************
 * Utils
 *****************************************************************************/

function getEnvironmentVariables(): {[key: string]: string} {
  return Object.fromEntries(
    Object.entries(process.env)
      .filter(([key, value]) => key.startsWith(APP_ENVIRONMENT_PREFIX) || value === undefined)
      .map(([key, value]) => [key.slice(APP_ENVIRONMENT_PREFIX.length), value])
  ) as {[key: string]: string};
}

function safeParseInt(value: string, _default: number): number {
  const parsed = parseInt(value);
  if (isNaN(parsed)) {
    console.error(`Invalid integer value: ${value}`);
    return _default;
  }
  return parsed;
}