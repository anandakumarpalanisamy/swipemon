import { Injectable } from '@angular/core';
import * as moment from 'moment';​
import { Employee, DayPunch } from '../models/employee';

@Injectable()
export class EmployeeDataService {

  employees: Employee[];
  odcName;
  year;
  month;

  constructor() {
  }

  public processRowData(rowData: any[]): any {

    const [ odcRow, odcAccessLevelRow, yearRow, monthRow, headerRow, ...employeeRecords ] = rowData;
    const { __EMPTY: odcName } = odcRow;
    const { __EMPTY: year } = yearRow;
    const { __EMPTY: month } = monthRow;
    this.employees = [];
    this.odcName = odcName;
    this.year = year;
    this.month = month;

    employeeRecords.splice(-1, 1);

    employeeRecords.forEach(employeeRecord => {
      this.employees.push(this.processEmployeeRecord(employeeRecord, year, month));
    });

    return {
      odcName,
      year,
      month,
      employees: this.employees
    };
  }

  private processEmployeeRecord(employeeRecord: any, year: string, month: string) {

    const {
      ['ODC Attendance Report']: id,
      __EMPTY: name,
      __EMPTY_1: projectId,
      __EMPTY_2: projectName,
      __EMPTY_3: totalStrMonthHours,
      ...dayRecords
    } = employeeRecord;

    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];
    const totalMonthHours = Number(Number(totalStrMonthHours).toFixed(2));

    const dayLevelStats = this.processEmployeeDayLevelPunches(year, month, dayRecords);

    const employee: Employee = {
      id,
      firstName,
      lastName,
      projectId,
      projectName,
      totalMonthHours,
      dayLevelStats
    };

    // console.log(JSON.stringify(employee));

    return employee;
  }

  private processEmployeeDayLevelPunches(year: string, month: string, dayRecord: any): DayPunch[] {

    // collection to store the employee's day level punches
    const dayPunches: DayPunch[] = [];

    // Find out number of days based on the year & month of the report
    const yearMonth = year + month;
    const noOfDays = moment(yearMonth, 'YYYYMM').daysInMonth();
    let lastProcessField: string;

    for (let i = 1; i <= noOfDays; i++) {
      let tempDay = '0';
      if (i < 10) {
        tempDay = tempDay.concat(i.toString());
      } else {
        tempDay = i.toString();
      }
      const date = moment(tempDay + month + year, 'DDMMYYYY').format('YYYY-MM-DD').toString();
      const currentDate = moment().format('YYYY-MM-DD');
      let punchInField;
      let punchOutField;
      let totalHoursField;
      let productiveHoursField;

      if (lastProcessField) {
        const lastKnownIndex = Number(lastProcessField.split('_')[3]);
        punchInField = '__EMPTY_' + (lastKnownIndex + 1);
        punchOutField = '__EMPTY_' + (lastKnownIndex + 2);
        totalHoursField = '__EMPTY_' + (lastKnownIndex + 3);
        productiveHoursField = '__EMPTY_' + (lastKnownIndex + 4);
        lastProcessField = productiveHoursField;
      } else {
        punchInField = '__EMPTY_' + (i + 3);
        punchOutField = '__EMPTY_' + (i + 4);
        totalHoursField = '__EMPTY_' + (i + 5);
        productiveHoursField = '__EMPTY_' + (i + 6);
        lastProcessField = productiveHoursField;
      }

      dayPunches.push({
        date: date,
        dayOfWeek: moment(date, 'YYYY-MM-DD').get('day').toString(),
        punchIn: dayRecord[punchInField] === 'N.A'
          ? currentDate.concat('T').concat('00:00:00') : currentDate + 'T' + dayRecord[punchInField],
        punchOut: dayRecord[punchOutField] === 'N.A'
          ? currentDate.concat('T').concat('00:00:00') : currentDate + 'T' + dayRecord[punchOutField],
        totalHours: dayRecord[totalHoursField] === 'N.A'
          ? 0 : Number(dayRecord[totalHoursField]),
        totalProductiveHours: dayRecord[productiveHoursField] === 'N.A'
          ? 0 : Number(dayRecord[productiveHoursField])
      });
    }
    return dayPunches.filter(day => day.dayOfWeek !== '0' && day.dayOfWeek !== '6');
  }

  public getEmployeeRecord(id: string) {
    return this.employees.find(employee => employee.id === id);
  }

  public getMonthName(month: number) {
    switch (month) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
    }
  }
}
