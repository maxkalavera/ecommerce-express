import lodash from 'lodash';
import { getTableColumns, Table } from 'drizzle-orm';

export class CoreAccessor {
  public includecolumns: string[] = [];
  public excludeColumns: string[] = [];

  public getColumns (
    table: Table, 
    options: { 
      include?: string[];
      exclude?: string[];
    } = {}
  ) {
    const _options = lodash.defaults(options, {
      include: this.includecolumns,
      exclude: this.excludeColumns,
    });

    const columns = getTableColumns(table);

    if (_options.include.length > 0) {
      const filteredColumns: Record<string, any> = {};
      for (const [name, column] of Object.entries(columns)) {
        if (_options.include.includes(name)) {
          filteredColumns[name] = column;
        }
      }
      return filteredColumns;
    } else if (_options.exclude.length > 0) {
      const filteredColumns: Record<string, any> = {};
      for (const [name, column] of Object.entries(columns)) {
        if (!_options.exclude.includes(name)) {
          filteredColumns[name] = column;
        }
      }
      return filteredColumns;
    }

    return columns;
  }

}