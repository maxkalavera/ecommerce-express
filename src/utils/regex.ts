import { sql } from "drizzle-orm";

export const URL_REGEX = 
  /^https?:\/\/(?:www\.)?[-\w@:%._\+~#=]+(\.[a-zA-Z]+)?(?:[-\w@:%_\+.~#?&\/\/=]*)$/;

export function toPostgreSQLRegex(regex: RegExp) {
  const escapedRegex = regex.toString().slice(1, -1);
  return sql.raw(`'${escapedRegex}'`);
}