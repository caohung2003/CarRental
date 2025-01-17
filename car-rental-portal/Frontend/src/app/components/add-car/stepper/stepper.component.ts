import { Component, Input } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent {
  @Input() public activeStep : string;
  @Input() public steps: string[] ;
}
