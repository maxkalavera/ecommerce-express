// schema/customTypes.ts
import { customType } from 'drizzle-orm/pg-core';
import base64url from 'base64url';

export const customUUID = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'uuid'; // PostgreSQL UUID type
  },
  // Transform the value when **fetched** from the database
  fromDriver(value: string): string {
    return base64url.encode(value);
  },
  // Optional: Transform the value when **sent** to the database
  toDriver(value: string): string {
    return base64url.decode(value);    
  },
});

/******************************************************************************
 * Utils
 *****************************************************************************/

