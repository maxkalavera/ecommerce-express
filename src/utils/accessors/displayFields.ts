import lodash from 'lodash';
import { APIError } from '@/utils/errors';

/******************************************************************************
 * Types
 *****************************************************************************/

export type DisplayFieldsOptions = {
  includeFields: string[] | null;
  excludeFields: string[] | null;
}

/******************************************************************************
 * Utils
 *****************************************************************************/

export function toDisplayFields <
  DataType extends Record<string, any> | Record<string, any>[]
> (
  data: DataType,
  _options: Partial<DisplayFieldsOptions> = {}
): DataType
{
  const options = lodash.defaults(_options, {
    includeFields: null,
    excludeFields: null,
  }) as DisplayFieldsOptions;
  const isArray = Array.isArray(data);
  const fields = Object.keys(isArray ? data[0] : data);
  const displayFields: string[] = [];

  try {
    if (Array.isArray(options.includeFields)) {
      displayFields.push(...options.includeFields.filter(column => fields.includes(column)));
    } else if (Array.isArray(options.excludeFields)) {
      displayFields.push(...fields.filter(column =>!options.excludeFields!.includes(column)));
    } else {
      displayFields.push(...fields);
    }

    const mappingFunction = (item: Record<string, any>) => {
      const mappedData: Record<string, any> = {};
      for (const column of displayFields) {
        if (item[column] !== undefined) {
          mappedData[column] = item[column];
        }
      }
      return mappedData;
    };
    return (isArray ? data.map(mappingFunction) : mappingFunction(data)) as DataType;

  } catch (error) {
    throw APIError.fromError(error, { code: 500, message: 'Error mapping to display columns' })
  }
}