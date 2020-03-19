import {EnumAlertTypes} from '../enums/EnumAlertTypes';

export interface InterfaceAlert {
  type?: EnumAlertTypes;
  head?: string;
  message: string;
}
