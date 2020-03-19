import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateHelperService {

  constructor() {
  }

  static getShortMonthFromId(monthId: number) {
    const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthArray[monthId - 1];
  }

  static getFullMonthFromId(monthId: number) {
    const monthArray = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthArray[monthId - 1];
  }

  static getShortYear(year: number) {
    return year.toString().replace('20', '');
  }
}
