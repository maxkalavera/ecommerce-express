import lodash from 'lodash';
import { getTableColumns, Table } from 'drizzle-orm';
import { OperationReturnType } from '@/types/commons';
import { APIError } from '@/utils/errors';

export class CoreAccessor {
  public includecolumns: string[] = [];
  public excludeColumns: string[] = [];

  protected _assertResult () {

  }

  public getDisplayColumns (
    table: Table, 
    options: {
      all?: boolean;
      include?: string[];
      exclude?: string[];
    } = {}
  ): OperationReturnType<ReturnType<typeof getTableColumns>>
  {
    try {
      const _options = lodash.defaults(options, {
        all: false,
        include: this.includecolumns,
        exclude: this.excludeColumns,
      });
  
      const columns = getTableColumns(table);
  
      if (_options.all) {
        return { success: true, data: columns };
      } else if (_options.include.length > 0) {
        const filteredColumns: Record<string, any> = {};
        for (const [name, column] of Object.entries(columns)) {
          if (_options.include.includes(name)) {
            filteredColumns[name] = column;
          }
        }
        return { success: true, data: filteredColumns };
  
      } else if (_options.exclude.length > 0) {
        const filteredColumns: Record<string, any> = {};
        for (const [name, column] of Object.entries(columns)) {
          if (!_options.exclude.includes(name)) {
            filteredColumns[name] = column;
          }
        }
        return { success: true, data: filteredColumns };
      }
  
      return {
        success: true,
        data: columns,
      };
    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Internal Server Error'),
      };
    }

  }

}