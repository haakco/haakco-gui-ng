import {Injectable} from '@angular/core';
import isObject from 'lodash-es/isObject';
import isString from 'lodash-es/isString';
import isUndefined from 'lodash-es/isUndefined';
import {InterfaceTableExtraFilter} from '../../interfaces/InterfaceTableExtraFilter';

@Injectable({
  providedIn: 'root',
})
export class TableService {

  public page = 1;
  public itemsPerPage = 10;
  public maxSize = 20;
  public numPages = 1;
  public length = 0;
  public columns: Array<any> = [];
  public extraFilter: InterfaceTableExtraFilter = {};
  private data: Array<any> = [];
  private collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

  private tableConfig;

  constructor() {
  }

  public setColumns(columns: Array<any>) {
    this.columns = columns;
  }

  public setConfig(tableConfig) {
    this.tableConfig = tableConfig;
  }

  public setData(data: Array<any>): Array<any> {
    this.data = data;
    this.length = this.data.length;
    return this.onChangeTable(this.tableConfig);
  }

  public setExtraFilter(extraFilter: InterfaceTableExtraFilter) {
    this.extraFilter = extraFilter;
    return this.onChangeTable(this.tableConfig);
  }

  public changePage(page: any = this.page, data: Array<any> = this.data): Array<any> {
    const start = (
      page.page - 1
    ) * page.itemsPerPage;
    const end = start + page.itemsPerPage < data.length ?
      (
        start + page.itemsPerPage
      ) :
      data.length;
    return data.slice(start, end);
  }

  public changeSort(data: any, tableConfig: any): any {
    if (!tableConfig.sorting) {
      return data;
    }

    const columns = this.tableConfig.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (const column of columns) {
      if (column.sort !== '' &&
        column.sort !== false
      ) {
        if (isUndefined(columnName) ||
          (
            !isUndefined(column.sort) && column.sort !== ''
          )) {
          columnName = column.name;
          sort = column.sort;
        }
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {

      const previousColumn = previous[columnName];
      const currentColumn = current[columnName];

      if (isString(previousColumn) && isString(currentColumn)) {
        const previousUpper = previousColumn.toUpperCase(); // ignore upper and lowercase
        const currentUpper = currentColumn.toUpperCase(); // ignore upper and lowercase
        return this.collator.compare(previousUpper, currentUpper) *
          (
            sort === 'desc' ? -1 : 1
          );
      }

      if (previousColumn > currentColumn) {
        return sort === 'desc' ? -1 : 1;
      } else if (previousColumn < currentColumn) {
        return sort === 'desc' ? 1 : -1;
      }
      return 0;
    });
  }

  public changeFilter(data: any, tableConfig: any): any {
    let filteredData: Array<any> = data;
    if (isObject(this.extraFilter) && Object.keys(this.extraFilter).length > 0) {
      filteredData = filteredData
        .filter((item) => {
          return Object.keys(this.extraFilter)
            .reduce((previousValue: boolean, columnName) => {
              if (this.extraFilter[columnName]) {
                if (this.extraFilter[columnName].equals) {
                  return previousValue && item[columnName] === this.extraFilter[columnName].equals;
                }
                if (this.extraFilter[columnName].does_not_equal) {
                  return previousValue && item[columnName] !== this.extraFilter[columnName].does_not_equal;
                }
              }
              return true;
            }, true);
        });
    }


    this.columns.map((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          if (!item[column.name]) {
            return ''.match(column.filtering.filterString);
          }
          if (item[column.name].match) {
            return item[column.name].toLowerCase().match(column.filtering.filterString.toLowerCase());
          }
          if (item[column.name].toString) {
            return item[column.name].toString().toLowerCase().match(column.filtering.filterString.toLowerCase());
          }
        });
      }
    });

    if (tableConfig && !tableConfig.filtering) {
      return filteredData;
    }

    if (tableConfig && tableConfig.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[tableConfig.filtering.columnName].toString().toLowerCase().match(this.tableConfig.filtering.filterString.toLowerCase()));
    }

    const tempArray: Array<any> = [];
    filteredData.map((item: any) => {
      let flag = false;
      this.columns.map((column: any) => {
        if (item[column.name] !== null && isString(item[column.name])) {
          if (item[column.name].toString().toLowerCase().match(this.tableConfig.filtering.filterString.toLowerCase())) {
            flag = true;
          }
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public onChangeTable(tableConfig: any, page: any = {page: this.page, itemsPerPage: this.itemsPerPage}): any {
    this.itemsPerPage = page.itemsPerPage;

    if (tableConfig && tableConfig.filtering) {
      Object.assign(this.tableConfig.filtering, tableConfig.filtering);
    }

    if (tableConfig && tableConfig.sorting) {
      Object.assign(this.tableConfig.sorting, tableConfig.sorting);
    }

    const filteredData = this.changeFilter(this.data, this.tableConfig);
    const sortedData = this.changeSort(filteredData, this.tableConfig);
    this.length = sortedData.length;

    return page && tableConfig.paging ? this.changePage(page, sortedData) : sortedData;
  }
}
