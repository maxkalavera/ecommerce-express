
import { Model as ModelType } from "@/models/types";
import { productsModel } from "@/models/products";
import { buildMixin } from "@/utils/patterns";
import db from "@/db";
import { sql } from 'drizzle-orm';
import { z } from "zod";
import { ModelAccessor } from "@/accessors/types";

/******************************************************************************
 * Mixins
 *******************************************************************************/

export function buildModelAccessorMixin<
  Model extends ModelType,
> (
  model: Model
) {
  const table = model.table;
  type ModelInstance = z.infer<typeof model.schemas.select>;
  return buildMixin<ModelAccessor<Model, ModelInstance>> ({
    model: model as any,
    table: model.table as any,

    async create(target, data) {
      const { id, key, ...insertData } = data;
      const returned = await db.insert(table).values(insertData).returning() as ModelInstance[];
      return returned[0] as ModelInstance;
    },

    async read(target, id) {
      const returned = await db.select().from(table).where(sql`${table}.id = ${id}`);
      return returned.length > 0 ? returned[0] as Model : null;
    },

    async readAll(target) {
      const returned = await db.select().from(table);
      return returned as ModelInstance[];
    },

    async update(target, id, data) {
      const { id: _, key, ...updateData } = data;
      const returned = await db.update(table)
        .set(updateData)
        .where(sql`${table}.id = ${id}`)
        .returning();
      return returned[0] as ModelInstance;
    },

    async delete(target, id) {
      const returned = await db.delete(table)
        .where(sql`${table}.id = ${id}`)
        .returning() as ModelInstance[];
      return returned.length > 0;
    }
  });
}

const productsAccessorsMixin = buildModelAccessorMixin(productsModel);