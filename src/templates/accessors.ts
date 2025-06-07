import * as op from 'drizzle-orm';
import { Static } from '@sinclair/typebox';
import { db } from '@/db';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { APIError } from '@/utils/errors';

// @customize
class BaseAccessor extends CoreAccessor {
  public table = null as any;  // @customize
  public excludeFields: string[] = ['id'];
  protected insertSchema = null as any;  // @customize
  protected updateSchema = null as any;  // @customize


};

// @customize
export const baseAccessor = new BaseAccessor();