import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-date-range',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './date-range.component.html',
    styleUrl: './date-range.component.css'
})
export class DateRangeComponent implements OnInit, OnChanges {
    @Input() disabled: boolean = false;
    @Input() hasTime: boolean = true;
    ngOnChanges(changes: SimpleChanges): void {
        for (let propName in changes) {
            if (propName == 'selectedTimeStart') {
                let change = changes[propName];
                let curVal = JSON.stringify(change.currentValue);
                let prevVal = JSON.stringify(change.previousValue);
                if (curVal != prevVal) {
                    if (curVal != undefined && curVal !== '') {
                        this.selectedTimeStart = curVal.replaceAll('"', '');
                        this.selectedTimeStartShow = this.convertTimeToMinutes(this.selectedTimeStart);
                        console.log(this.selectedTimeStart + ' ' + this.selectedTimeStartShow);

                    }
                }
            }
            else if (propName == 'selectedTimeEnd') {
                let change = changes[propName];
                let curVal = JSON.stringify(change.currentValue);
                let prevVal = JSON.stringify(change.previousValue);
                if (curVal != prevVal) {
                    if (curVal != undefined && curVal != '') {
                        this.selectedTimeEnd = curVal.replaceAll('"', '');
                        this.selectedTimeEndShow = this.convertTimeToMinutes(this.selectedTimeEnd);
                        console.log(this.selectedTimeEnd + ' ' + this.selectedTimeEndShow);
                    }
                }
            }

        }
    }




    @Input() start: string = "31/03/2024";
    @Input() end: string = "03/04/2024";
    @Input() selectedTimeStart: string = '';
    @Input() selectedTimeEnd: string = '';
    @Input() addMode: boolean;
    @ViewChild("startHtml", { static: false }) public startEle: ElementRef;
    @ViewChild("endHtml", { static: false }) public endEle: ElementRef;
    @Output() updateData: EventEmitter<string> = new EventEmitter();


    selectedTimeStartShow: number = 480;
    selectedTimeEndShow: number = 480;

    timeOptions: { value: number; label: string }[] = [];

    ngOnInit(): void {
        initFlowbite();
        this.initializeTimeOptions();
        this.selectedTimeStartShow = this.convertTimeToMinutes(this.selectedTimeStart);
        this.selectedTimeEndShow = this.convertTimeToMinutes(this.selectedTimeEnd);
        if (!this.hasTime) {
            this.selectedTimeStartShow = 0;
            this.selectedTimeEndShow = 1410;
        }
    }

    convertTimeToMinutes(timeString: string): number {
        if (timeString && timeString !== '') {
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 60 + minutes;
        }
        return 0;
    }
    private _myElementValue: any;



    initializeTimeOptions() {
        for (let hour = 0; hour < 24; hour++) {
            for (let minute of [0, 30]) {
                const value = hour * 60 + minute; // Calculate total minutes
                const label = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`; // Format label
                this.timeOptions.push({ value, label });
            }
        }
    }


    getDate(datetime
        :
        string
    ):
        string {
        const [datePart, timePart] = datetime.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        return `${day.length < 2 ? "0" + day : day}`;
    }

    getMonth(datetime
        :
        string
    ):
        string {
        const [datePart, timePart] = datetime.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        return `${month.length < 2 ? "0" + month : month}`;
    }

    getYear(datetime
        :
        string
    ):
        string {
        const [datePart, timePart] = datetime.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        return `${year}`;
    }

    getTime(datetime
        :
        string
    ):
        string {
        const [datePart, timePart] = datetime.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        return `${hour}:${minute}`;
    }

    roundStars(stars
        :
        number
    ):
        number {
        return Math.round(stars);
    }

    compareDates(dateTimeString1
        :
        string, dateTimeString2
            :
            string
    ):
        number {
        // Parse date-time strings into Date objects
        const dateTime1 = new Date(dateTimeString1);
        const dateTime2 = new Date(dateTimeString2);

        // Convert both date times to milliseconds since Unix epoch
        const time1 = dateTime1.getTime();
        const time2 = dateTime2.getTime();

        // Compare the milliseconds values
        if (time1 < time2) {
            return -1;
        } else if (time1 > time2) {
            return 1;
        } else {
            return 0; // Dates are equal
        }
    }

    convertDateFormat(dateTimeString
        :
        string
    ):
        string {
        const [datePart, timePart] = dateTimeString.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        return `${hour}:${minute}, ${day}/${month}/${year}`;
    }

    countDays(startDate
        :
        string, endDate
            :
            string
    ):
        string {
        if (startDate == null || endDate == null || "" == endDate || "" == startDate) return "…";
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end.getTime() < start.getTime()) return "…";
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays}`;
    }


    getDateFormatted(date
        :
        string
    ) {
        var s = date.split('-');
        return s[2] + '/' + s[1] + '/' + s[0];
    }

    getDateInput() {
        this.updateData.emit(this.startEle.nativeElement.value + "T" + this.selectedTimeStartShow + ' to ' + this.endEle.nativeElement.value + "T" + this.selectedTimeEndShow);
    }




}
