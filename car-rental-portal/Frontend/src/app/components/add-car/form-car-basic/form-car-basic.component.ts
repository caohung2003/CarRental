import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PaginatorModule } from "primeng/paginator";
import { BrandService } from "../../../services/brand.service";
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../../shared/header/header.component";
import Swal from "sweetalert2";
import { FormCarBasic } from "../../../models/interfaces/form-carbasic";
import { FeatureService } from "../../../services/feature.service";

export interface Brand {
  id: number,
  name: string
}

export interface BrandModel {
  id: number,
  name: string
}

@Component({
  selector: 'app-form-car-basic',
  standalone: true,
  imports: [
    PaginatorModule,
    NgForOf,
    FormsModule,
    HeaderComponent,
    NgIf
  ],
  templateUrl: './form-car-basic.component.html',
  styleUrl: './form-car-basic.component.css'
})

export class FormCarBasicComponent implements OnInit, OnChanges {
  public brands: Brand[] = [];
  public chooseBrand: string = "0";
  public chooseModel: string = "0";
  public brandModels: BrandModel[] = [];
  public function: string[] = [];
  public licensePlate: string = "";
  public seat: string = "4";
  public yearProduction: string = "2018";
  public transmission: string = "Automation";
  public fuel: string = "Diesel";
  public consumption: number = 10;
  public description: string = "";
  @ViewChild("model") public modelSlt: ElementRef;
  @ViewChild("modelChoose") public modelChoose: ElementRef;
  @Input() formCarBasic: FormCarBasic;
  @Input() mode: string = "";
  @Output() updateData: EventEmitter<string> = new EventEmitter();
  @Output() sendFormCarBasic: EventEmitter<FormCarBasic> = new EventEmitter();
  public carId: number;
  constructor(private brandService: BrandService, private featureService: FeatureService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName == 'mode') {
        let change = changes[propName];
        let curVal = JSON.stringify(change.currentValue);
        let prevVal = JSON.stringify(change.previousValue);
        if (curVal != prevVal) {
          if (curVal != undefined && curVal !== '') {
            console.log("Cur: " + curVal);
            this.mode = curVal.replaceAll('"', '');
          }
        }
      }
    }

  }


  ngOnInit(): void {
    console.log(this.formCarBasic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getAllBrand();
    if (this.formCarBasic != null) {
      this.carId = this.formCarBasic.carId != undefined ? (this.formCarBasic.carId) : 0;
      this.chooseBrand = this.formCarBasic.brandId.toString();
      this.chooseModel = this.formCarBasic.modelId.toString();
      this.function = this.formCarBasic.function;
      this.licensePlate = this.formCarBasic.licensePlate;
      this.seat = this.formCarBasic.seat.toString();
      this.yearProduction = this.formCarBasic.yearProduction.toString();
      this.transmission = this.formCarBasic.transmission;
      this.fuel = this.formCarBasic.fuel;
      this.consumption = this.formCarBasic.consumption;
      this.description = this.formCarBasic.description;
      for (let i = 0; i < this.function.length; i++) {
        var ele: string = "";
        switch (this.function[i]) {
          case 'USB': {
            ele = "usb1";
            break;
          }
          case 'Bluetooth': {
            ele = "bluetooth1";
            break;
          }
          case 'Map': {
            ele = "map1";
            break;
          }
          case 'DVD': {
            ele = "dvd";
            break;
          }
          case 'GPS': {
            ele = "gps";
            break;
          }
          case 'Child seat': {
            ele = "childseat";
            break;
          }
          case 'Camera 360': {
            ele = "camera360";
            break;
          }
          case 'Camera journey': {
            ele = "cameraj";
            break;
          }
          case 'ETC': {
            ele = "etc";
            break;
          }
        }
        var div = document.getElementById(ele);
        var divImg = document.getElementById(ele + "img");
        if (div != null && divImg != null) {
          div.style.backgroundColor = "black";
          div.style.color = "white";
          divImg.style.filter = "invert(100%) grayscale() saturate(10000%) hue-rotate(0deg)";
        }
      }
      this.loadModel();
    }
  }

  choose(ele: string) {
    var div = document.getElementById(ele);
    var divImg = document.getElementById(ele + "img");
    if (div != null && divImg != null) {
      if (div.style.backgroundColor == '') {
        switch (ele) {
          case 'usb1': {
            this.function.push('USB');
            break;
          }
          case 'bluetooth1': {
            this.function.push('Bluetooth');
            break;
          }
          case 'map1': {
            this.function.push('Map');
            break;
          }
          case 'dvd': {
            this.function.push('DVD');
            break;
          }
          case 'gps': {
            this.function.push('GPS');
            break;
          }
          case 'childseat': {
            this.function.push('Child seat');
            break;
          }
          case 'camera360': {
            this.function.push('Camera 360');
            break;
          }
          case 'cameraj': {
            this.function.push('Camera journey');
            break;
          }
          case 'etc': {
            this.function.push('ETC');
            break;
          }
        }
        div.style.backgroundColor = "black";
        div.style.color = "white";
        divImg.style.filter = "invert(100%) grayscale() saturate(10000%) hue-rotate(0deg)";
      } else {
        switch (ele) {
          case 'usb1': {
            var a = this.function.indexOf('USB');
            this.function.splice(a, 1);
            break;
          }
          case 'bluetooth1': {
            var a = this.function.indexOf('Bluetooth');
            this.function.splice(a, 1);
            break;
          }
          case 'map1': {
            var a = this.function.indexOf('Map');
            this.function.splice(a, 1);
            break;
          }
          case 'dvd': {
            var a = this.function.indexOf('DVD');
            this.function.splice(a, 1);
            break;
          }
          case 'gps': {
            var a = this.function.indexOf('GPS');
            this.function.splice(a, 1);
            break;
          }
          case 'childseat': {
            var a = this.function.indexOf('Child seat');
            this.function.splice(a, 1);
            break;
          }
          case 'camera360': {
            var a = this.function.indexOf('Camera 360');
            this.function.splice(a, 1);
            break;
          }
          case 'cameraj': {
            var a = this.function.indexOf('Camera journey');
            this.function.splice(a, 1);
            break;
          }
          case 'etc': {
            var a = this.function.indexOf('ETC');
            this.function.splice(a, 1);
            break;
          }
        }
        div.style.backgroundColor = '';
        div.style.color = "#6B7280";
        divImg.style.filter = "";
      }
    } else {

    }
  }


  getAllBrand() {
    this.brandService.getAllBrandName().subscribe(
      (response: any) => {
        for (let i = 0; i < response.length; i++) {
          var brand: Brand = {
            id: response[i].id,
            name: response[i].name
          };
          this.brands.push(brand);
        }
      }
    )
  }


  loadModel() {
    if (this.chooseBrand != "0") {
      this.brandModels = [];
      this.brandService.getAllBrandModelBasedOnBrandId(Number(this.chooseBrand)).subscribe(
        (response: any) => {
          for (let i = 0; i < response.length; i++) {
            var brandModel: BrandModel = {
              id: response[i].id,
              name: response[i].modelName
            };
            this.brandModels.push(brandModel);
          }
        }
      )
      this.modelChoose.nativeElement.textContent = "Not pick model";
      // this.modelSlt.nativeElement.disabled = "false";
    } else {
      this.modelChoose.nativeElement.textContent = "Choose a brand first";
      // this.modelSlt.nativeElement.disabled = "true";
    }
    this.chooseModel = "0";
  }



  submit() {
    var message: string = '';
    if (this.licensePlate.trim() == '') {
      message = 'You have not filled in the license plate number';
    }
    else if (this.chooseBrand == '0') {
      message = 'You have not selected the car brand';
    }
    else if (this.chooseModel == '0') {
      message = 'You have not selected the car model';
    }
    else if (this.consumption == null) {
      message = 'You have not filled in the fuel consumption';
    }
    if (message != '') {
      Swal.fire({
        title: 'Confirmation',
        html: message,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Close',
        confirmButtonColor: '#007bff',
      }).then((result) => {
      });
    }
    else {
      this.formCarBasic = {
        carId: this.carId,
        brandId: Number(this.chooseBrand),
        modelId: Number(this.chooseModel),
        function: this.function,
        licensePlate: this.licensePlate,
        seat: Number(this.seat),
        yearProduction: Number(this.yearProduction),
        transmission: this.transmission,
        fuel: this.fuel,
        consumption: this.consumption,
        description: this.description
      }
      this.sendFormCarBasic.emit(this.formCarBasic);
      this.updateData.emit('1');
    }
  }
}
