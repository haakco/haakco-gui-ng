import {EnumAlertTypes} from '../enums/EnumAlertTypes';

export interface InterfaceAlert {
  alertType?: EnumAlertTypes;
  head?: string;
  message: string;
}
