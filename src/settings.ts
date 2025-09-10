import lodash from 'lodash';
import dotenvDefaults from 'dotenv-defaults';
import path from 'node:path';

/******************************************************************************
 * Types
 *****************************************************************************/

export type Settings = {
  REQUIRED_SETTINGS: string[],
  ENV: "production" | "development"| "testing" | "staging",
  PORT: number;
  DATABASE: {
    HOST: string;
    NAME: string;
    PORT: number;
    USER: string;
    PASSWORD: string;
  },
  //DATABASE_URL: string;
  TESTING_DATABASE: {
    HOST: string;
    NAME: string;
    PORT: number;
    USER: string;
    PASSWORD: string;
  },
  //TESTING_DATABASE_URL: string;
  RUNTIME_FOLDER: string;
  BASE_URL: string;
  MEDIA_URL_PREFIX: string;
  MEDIA_STORAGE_FOLDER: string;
  SECRET_KEY: string;
  PAGINATION_DEFAULT_LIMIT: number;
  MAX_QUERY_LIMIT: number;
  PRODUCT_MAX_PUBLIC_AVAILABILITY: number;
};

/******************************************************************************
 * Settings
 *****************************************************************************/

dotenvDefaults.config();
const APP_ENVIRONMENT_PREFIX = "ECOMMERCE_";
const envs = getEnvironmentVariables();

const initials: Settings = {
  REQUIRED_SETTINGS: [],
  ENV: "development",
  PORT: 3001,
  DATABASE: { HOST: "", NAME: "", PORT: 3001, USER: "", PASSWORD: "" },
  TESTING_DATABASE: { HOST: "", NAME: "", PORT: 3001, USER: "", PASSWORD: "" },
  RUNTIME_FOLDER: path.resolve(process.cwd(), ".runtime"),
  BASE_URL: "",
  MEDIA_URL_PREFIX: "/media",
  MEDIA_STORAGE_FOLDER: path.resolve(process.cwd(), ".runtime/media/"),
  SECRET_KEY: "",
  PAGINATION_DEFAULT_LIMIT: 20,
  MAX_QUERY_LIMIT: 500,
  PRODUCT_MAX_PUBLIC_AVAILABILITY: 1000,
};

const fromEnvSettings: Partial<Settings> = {
  ENV: envs.ENV as Settings['ENV'],
  PORT: safeParseInt(envs.PORT, initials.PORT),
  DATABASE: {
    HOST: envs.POSTGRES_HOST,
    NAME: envs.POSTGRES_DB,
    PORT: safeParseInt(envs.POSTGRES_PORT, initials.DATABASE.PORT),
    USER: envs.POSTGRES_USER,
    PASSWORD: envs.POSTGRES_PASSWORD,
  },
  TESTING_DATABASE: {
    HOST: envs.POSTGRES_TEST_HOST,
    NAME: envs.POSTGRES_TEST_DB,
    PORT: safeParseInt(envs.POSTGRES_TEST_PORT, initials.DATABASE.PORT),
    USER: envs.POSTGRES_TEST_USER,
    PASSWORD: envs.POSTGRES_TEST_PASSWORD,
  },
  SECRET_KEY: envs.SECRET_KEY,
  PAGINATION_DEFAULT_LIMIT: safeParseInt(envs.PAGINATION_DEFAULT_LIMIT, initials.PAGINATION_DEFAULT_LIMIT),
  MAX_QUERY_LIMIT: safeParseInt(envs.MAX_QUERY_LIMIT, initials.MAX_QUERY_LIMIT),
  PRODUCT_MAX_PUBLIC_AVAILABILITY: safeParseInt(envs.PRODUCT_MAX_PUBLIC_AVAILABILITY, initials.PRODUCT_MAX_PUBLIC_AVAILABILITY),
  RUNTIME_FOLDER: envs.RUNTIME_FOLDER,
  BASE_URL: envs.BASE_URL,
  MEDIA_URL_PREFIX: envs.MEDIA_URL_PREFIX,
  MEDIA_STORAGE_FOLDER: envs.MEDIA_STORAGE_FOLDER,
};

const settings = validateSettings(
  lodash.defaults(
    fromEnvSettings,
    initials,
  )
) as Settings

export default settings;

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
    return _default;
  }
  return parsed;
}

export function validateSettings(settings: Settings) {
  settings.REQUIRED_SETTINGS.forEach((setting) => {
    if (!settings[setting as keyof Settings]) {
      throw new Error(`Missing required setting: ${setting}`);
    }
  });

  return settings;
}