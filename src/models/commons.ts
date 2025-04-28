import { 
  integer, 
  uuid,
} from "drizzle-orm/pg-core";
import { buildTarget } from "@/utils/patterns";
import { buildModelMixin } from "@/models/mixins/models"

export const commonColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: uuid().defaultRandom().notNull(),
}

export function buildModel<
  Name extends string,
  Columns extends Record<string, any>,
  extraConfig extends (...args: any) => any,
> (
  name: Name, 
  columns: Columns, 
  extraConfig?: extraConfig
) {
  return buildTarget(
    buildModelMixin<Name, Columns, extraConfig> (
      name,
      columns,
      extraConfig
    ),
  );
};