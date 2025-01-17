import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class NgbDateCustomerParserFormatter extends NgbDateParserFormatter {
  constructor(private datePipe: DatePipe) {
    super();
  }

  override parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = new Date(value);
      //   console.log('PARSE DATE:')
      //   console.log(date);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }
    return null;
  }

  override format(date: NgbDateStruct | null): string {
    let currentDay:string = '';
    let currentMonth:string = '';

    currentDay = date && date.day < 10 ? '0' + date.day : `${date?.day ?? '10'}`;
    currentMonth = date && date.month < 10 ? '0'+(date.month) : `${date?.month}`;
    return date ? `${currentDay}-${currentMonth}-${date.year}`:'';
    // if (!date) return '';
    // const formattedDate = new Date(date.year, date.month - 1, date.day);
    // return this.datePipe.transform(formattedDate, 'dd-MM-yyyy') || '';
  }
}
