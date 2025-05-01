import { 
  integer, 
  uuid,
} from "drizzle-orm/pg-core";

export const commonColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: uuid().defaultRandom().notNull(),
};

