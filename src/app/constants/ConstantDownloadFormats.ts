import {InterfaceDownloadFormat} from '../interfaces/InterfaceDownloadFormat';

export const ConstantDownloadFormats: { [id: string]: InterfaceDownloadFormat } = {
  csv: {
    name: 'csv',
    mime: 'application/csv; charset=UTF-8',
  },
  excel: {
    name: 'Excel',
    mime: 'application/vnd.ms-excel',
  },
  json: {
    name: 'Json',
    mime: 'application/json',
  },
};

