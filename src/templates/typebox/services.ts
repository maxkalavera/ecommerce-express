// @ts-nocheck

import { Type } from '@sinclair/typebox';
import { Nullable } from '@/utils/typebox';
import { CommonIdentifiers, CommonQueryParams } from '@/typebox/services/commons';


export const ___ = Type.Object({

});

export const ___Insert = Type.Object({

});

export const ___Update = Type.Object({

});

export const ___Identifiers = Type.Composite([
  CommonIdentifiers,
  Type.Object({})
]);

export const ___QueryParams = Type.Composite([
  CommonQueryParams,
  Type.Object({})
]);