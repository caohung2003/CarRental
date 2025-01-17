import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements OnInit {
  @Input() defaultDate: string = '';
  @Input() title: string = '';
  @Input() disable: boolean = false;
  @Input() required:boolean = false;
  @Output() result: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    initFlowbite();
  }

  changeValue(event: any) {
    let value = event.target.value;
    this.result.emit(value);
  }
}
