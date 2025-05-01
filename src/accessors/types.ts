
import { Model as ModelType } from "@/models/types";
import { Resolve, GenericObject } from "@/types/commons";
import { Target, Mixin } from "@/types/patterns";
import { ID } from "@/types/db";

export type AccessorMixin<
  TargetParam extends Target = Target,
> = Mixin<TargetParam>;

export type ModelAccessor<
  ModelParam extends ModelType,
  ModelInstance extends Record<string, any>,
> = Resolve<{
  model: ModelParam;
  table: ModelParam["table"];
  create(data: ModelInstance): Promise<ModelInstance>;
  read(id: ID): Promise<ModelInstance | null>;
  readAll(): Promise<ModelInstance[]>;
  update(id: ID, data: Partial<ModelInstance>): Promise<ModelInstance | null>;
  delete(id: ID): Promise<boolean>;
}>;

export type ModelAccessorMixin<
  ModelParam extends ModelType = ModelType,
  ModelInstance extends Record<string, any> = Record<string, any>,
> = AccessorMixin<ModelAccessor<ModelParam, ModelInstance>>;
