import {CarBusyCalendar} from "./car-busy-calendar";

export interface FormCarCalendar {
  startRent: string,
  endRent: string,
  carBusys: CarBusyCalendar[],
  listDisplay: string[],
  rentTime: number,
  allBusys?: CarBusyCalendar[]
}
