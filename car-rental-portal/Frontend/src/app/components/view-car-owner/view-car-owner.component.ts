import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CarService} from "../../services/car.service";
import {FormCarBasic} from "../../models/interfaces/form-carbasic";
import {FormCarDetail} from "../../models/interfaces/form-cardetail";
import {FormCarPricing} from "../../models/interfaces/form-carpricing";
import {FormCarCalendar} from "../../models/interfaces/form-carcalendar";
import {ActivatedRoute} from "@angular/router";
import {AddCarComponent} from "../add-car/add-car.component";
import {FormCarLocation} from "../../models/interfaces/form-carlocation";
import {response} from "express";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-view-car-owner',
  standalone: true,
  imports: [
    AddCarComponent,
    NgIf
  ],
  templateUrl: './view-car-owner.component.html',
  styleUrl: './view-car-owner.component.css'
})
export class ViewCarOwnerComponent implements OnInit {
  constructor(private carService: CarService, public route: ActivatedRoute) {

  }

  public isLoading: boolean = true;

  public formCarBasic: FormCarBasic;
  public formCarDetail: FormCarDetail;
  public formCarPricing: FormCarPricing;
  public formCarCalendar: FormCarCalendar;


  ngOnInit(): void {
  }


  protected readonly Number = Number;
}
