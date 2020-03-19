export interface InterfaceTableExtraFilter {
  [columnName: string]: {
    equals?: any;
    does_not_equal?: any;
  };
}
