// schema/customTypes.ts
import { customType, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import base64url from 'base64url';
import { ReturnType } from '@sinclair/typebox';


export const urlFriendlyUUID = customType<{
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