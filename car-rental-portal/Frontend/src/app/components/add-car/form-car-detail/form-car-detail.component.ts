import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { PaginatorModule } from "primeng/paginator";
import H from "@here/maps-api-for-javascript";
import { MapComponent } from "../../map/map.component";
import { HttpErrorResponse } from "@angular/common/http";
import { Location } from "../../../models/interfaces/location";
import { MapService } from "../../../services/map.service";
import { LocationService } from "../../../services/location.service";
import Swal from "sweetalert2";
import { FormCarDetail } from "../../../models/interfaces/form-cardetail";
import { FormCarLocation } from "../../../models/interfaces/form-carlocation";

@Component({
  selector: 'app-form-car-detail',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    PaginatorModule,
    MapComponent,
    NgIf
  ],
  templateUrl: './form-car-detail.component.html',
  styleUrl: './form-car-detail.component.css'
})
export class FormCarDetailComponent implements OnInit, OnChanges {
  @Input() public formCarDetail: FormCarDetail;

  @Output() updateData: EventEmitter<string> = new EventEmitter();
  @Output() sendFormCarDetail: EventEmitter<FormCarDetail> = new EventEmitter();

  @ViewChild("frontImg") public frontImg: ElementRef;
  public frontUrl: string = "";

  @ViewChild("backImg") public backImg: ElementRef;
  public backUrl: string = "";

  @ViewChild("leftImg") public leftImg: ElementRef;
  public leftUrl: string = "";

  @ViewChild("rightImg") public rightImg: ElementRef;
  public rightUrl: string = "";

  @ViewChild("registrationImg") public registrationImg: ElementRef;
  public registrationUrl: string = "";

  @ViewChild("inspectionImg") public inspectionImg: ElementRef;
  public inspectionUrl: string = "";

  @ViewChild("insuranceImg") public insuranceImg: ElementRef;
  public insuranceUrl: string = "";

  public mapMode: boolean = false;
  public chooseCity: string = "0";
  public chooseDistrict: string = "0";
  public chooseWard: string = "0";

  public frontImgFile: any;
  public backImgFile: any;
  public leftImgFile: any;
  public rightImgFile: any;
  public registrationImgFile: any;
  public inspectionImgFile: any;
  public insuranceImgFile: any;

  public latF: number = 0;
  public lngF: number = 0;
  public road: string = "";

  @Input() mode: string = "";


  public mileage: number = 10;
  public cancelPending: number = 1;
  public cancelPendingDeposit: number = 1;

  public cities: Location[] = [];
  public districts: Location[] = [];
  public wards: Location[] = [];

  public saveRoad: string = "";

  constructor(private mapService: MapService, private locationService: LocationService) {

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (this.formCarDetail != null) {

      this.mileage = this.formCarDetail.mileage;
      this.road = this.formCarDetail.road;
      this.saveRoad = this.road;
      this.chooseWard = this.formCarDetail.location[0].wardId.toString();
      this.latF = this.formCarDetail.location[0].lat;
      this.lngF = this.formCarDetail.location[0].lng;
      this.cancelPending = this.formCarDetail.timeCancelPending;
      this.cancelPendingDeposit = this.formCarDetail.timeCancelPendingDeposit;

      this.frontUrl = this.formCarDetail.frontUrl;
      this.frontImgFile = this.formCarDetail.frontImgFile;

      this.backUrl = this.formCarDetail.backUrl;
      this.backImgFile = this.formCarDetail.backImgFile;

      this.leftUrl = this.formCarDetail.leftUrl;
      this.leftImgFile = this.formCarDetail.leftImgFile;

      this.rightUrl = this.formCarDetail.rightUrl;
      this.rightImgFile = this.formCarDetail.rightImgFile;

      this.registrationUrl = this.formCarDetail.registrationUrl;
      this.registrationImgFile = this.formCarDetail.registrationImgFile;

      this.inspectionUrl = this.formCarDetail.inspectionUrl;
      this.inspectionImgFile = this.formCarDetail.inspectionImgFile;

      this.insuranceUrl = this.formCarDetail.insuranceUrl;
      this.insuranceImgFile = this.formCarDetail.insuranceImgFile;

      if (this.frontUrl != '')
        this.hiddenSvg('front');
      if (this.backUrl != '')
        this.hiddenSvg('back');
      if (this.leftUrl != '')
        this.hiddenSvg('left');
      if (this.rightUrl != '')
        this.hiddenSvg('right');
      if (this.registrationUrl != '')
        this.hiddenSvg('registration');
      if (this.inspectionUrl != '')
        this.hiddenSvg('inspection');

      if (this.insuranceUrl != null && this.insuranceUrl != '')
        this.hiddenSvg('insurance');
    }
  }

  closeMap(location: string) {
    var c = "1";
    var d = "1";
    var w = "1";
    if (location != '') {
      for (let i = 0; i < location.length; i++) {
        if (location[i] == ',') {
          this.latF = Number(location.slice(0, i));
          this.lngF = Number(location.slice(i + 2));
        }
      }
      this.mapService.getLocationByLatAndLng(this.latF, this.lngF).subscribe(
        (response: any) => {
          c = "Thành phố " + response.items[0].address.county
          d = response.items[0].address.city;
          w = response.items[0].address.district;
          var a = response.items[0].title;
          this.road = "";
          if (!a.includes(response.items[0].address.county)) {
            this.road += (c + ", ");
          }
          if (!a.includes(response.items[0].address.city)) {
            this.road += (d + ", ");
          }
          if (!a.includes(response.items[0].address.district)) {
            this.road += (w + ", ");
          }
          this.road += a;
          this.saveRoad = a;
          this.specialLoad(c, d, w);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    }
    this.mapMode = false;
    ''
  }

  removeDiacritics(inputString: string): string {
    var a: string = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (a.includes("Thanh pho")) {
      a = a.replace("Thanh pho", "");
    } else if (a.includes("Tinh")) {
      a = a.replace("Tinh", "");
    } else if (a.includes("Quan")) {
      a = a.replace("Quan", "");
    } else if (a.includes("Huyen")) {
      a = a.replace("Huyen", "");
    } else if (a.includes("Thi xa")) {
      a = a.replace("Thi xa", "");
    } else if (a.includes("Phuong")) {
      a = a.replace("Phuong", "");
    } else if (a.includes("Xa")) {
      a = a.replace("Xa", "");
    }
    a = a.trim();
    if (a == "Thua Thien-Hue") {
      a = "Thua Thien Hue";
    }
    return a;
  }

  specialLoad(city: string, district: string, ward: string) {
    var cChoose: boolean = false;
    var dChoose: boolean = false;
    var wChoose: boolean = false;
    this.locationService.getAllCities().subscribe(
      (response: any) => {
        for (let i = 0; i < response.length; i++) {
          if (this.removeDiacritics(response[i].cityName) == this.removeDiacritics(city)) {
            cChoose = true;
            this.chooseCity = response[i].cityCode;
            this.districts = [];
            this.locationService.getAllDistrictsByCityCode(this.chooseCity).subscribe(
              (response: any) => {
                for (let j = 0; j < response.length; j++) {
                  if (this.removeDiacritics(response[j].districtName) == this.removeDiacritics(district)) {
                    dChoose = true;
                    this.chooseDistrict = response[j].districtCode;
                    this.wards = [];
                    this.locationService.getAllWardsByCityCodeAndDistrictCode(this.chooseCity, this.chooseDistrict).subscribe(
                      (response: any) => {
                        for (let k = 0; k < response.length; k++) {
                          if (this.removeDiacritics(response[k].wardName) == this.removeDiacritics(ward.trim())) {
                            wChoose = true;
                            this.chooseWard = response[k].id;
                          }
                          if (!wChoose) {
                            this.chooseWard = "0";
                          }
                          var location: Location = {
                            id: response[k].id,
                            code: response[k].wardCode,
                            name: response[k].wardName
                          }

                          this.wards.push(location);
                        }
                      }
                    )
                  }
                  if (!dChoose) {
                    this.chooseDistrict = "0";
                    this.chooseWard = "0";
                  }
                  var location: Location = {
                    id: response[j].id,
                    code: response[j].districtCode,
                    name: response[j].districtName
                  }
                  this.districts.push(location);
                }
              },
            )
          }
          if (!cChoose) {
            this.chooseCity = "0";
            this.chooseDistrict = "0";
            this.chooseWard = "0";
          }
          var location: Location = {
            id: response[i].id,
            code: response[i].cityCode,
            name: response[i].cityName
          }
          this.cities.push(location);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        //this.route.navigate(['/notfound']);
      }
    );
  }

  zoom: number = 2;
  lat: number = 0;
  lng: number = 0;

  handleMapChange(event: H.map.ChangeEvent) {
    if (event.newValue.lookAt) {
      const lookAt = event.newValue.lookAt;
      this.zoom = lookAt.zoom;
      this.lat = lookAt.position.lat;
      this.lng = lookAt.position.lng;
    }
  }

  openMap() {
    var a = document.getElementById("mp");
    if (a != null) {
      a.style.display = 'block';
      this.mapMode = true;
    }
  }

  hiddenSvg(type: string) {
    var ele = document.getElementById(type);
    var eleSvg = document.getElementById(type + "Svg");
    var pSvg = document.getElementById("p" + type.substring(0, 1).toUpperCase() + type.substring(1));
    var p1Svg = document.getElementById("p" + type.substring(0, 1).toUpperCase() + type.substring(1) + "1");

    if (ele != null && eleSvg != null && pSvg != null && p1Svg != null) {
      eleSvg.classList.add("tw-hidden");
      pSvg.classList.add("tw-hidden");
      p1Svg.classList.add("tw-hidden");
      ele.classList.remove("tw-hidden");
    }
  }

  changeImage(event: any, type: string) {
    var reader = new FileReader();
    if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/jpg" || event.target.files[0].type == "image/png") {
      if (type == 'front')
        this.frontImgFile = event.target.files[0];
      else if (type == 'back')
        this.backImgFile = event.target.files[0];
      else if (type == 'left')
        this.leftImgFile = event.target.files[0];
      else if (type == 'right')
        this.rightImgFile = event.target.files[0];
      else if (type == 'registration')
        this.registrationImgFile = event.target.files[0];
      else if (type == 'inspection')
        this.inspectionImgFile = event.target.files[0];
      else if (type == 'insurance')
        this.insuranceImgFile = event.target.files[0];
      // let form = new FormData();
      //
      // form.append('multipartFile', this.frontImgFile);
      // form.append('name', 'tét');
      reader.onload = (event: any) => {
        if (type == 'front') {

          this.frontUrl = event.target.result;
          var ele = document.getElementById("front");
          var eleSvg = document.getElementById("frontSvg");
          var pSvg = document.getElementById("pFront");
          var p1Svg = document.getElementById("pFront1");

          if (ele != null && eleSvg != null && pSvg != null && p1Svg != null) {
            eleSvg.classList.add("tw-hidden");
            pSvg.classList.add("tw-hidden");
            p1Svg.classList.add("tw-hidden");
            ele.classList.remove("tw-hidden");
          }
        } else if (type == 'back') {
          this.backUrl = event.target.result;
          var ele = document.getElementById("back");
          var eleSvg = document.getElementById("backSvg");
          var pSvg = document.getElementById("pBack");
          var p1Svg = document.getElementById("pBack1");

          if (ele != null && eleSvg != null && pSvg != null && p1Svg != null) {
            eleSvg.classList.add("tw-hidden");
            pSvg.classList.add("tw-hidden");
            p1Svg.classList.add("tw-hidden");
            ele.classList.remove("tw-hidden");
          }
        } else if (type == 'left') {
          this.leftUrl = event.target.result;
          var ele = document.getElementById("left");
          var eleSvg = document.getElementById("leftSvg");
          var pSvg = document.getElementById("pLeft");
          var p1Svg = document.getElementById("pLeft1");

          if (ele != null && eleSvg != null && pSvg != null && p1Svg != null) {
            eleSvg.classList.add("tw-hidden");
            pSvg.classList.add("tw-hidden");
            p1Svg.classList.add("tw-hidden");
            ele.classList.remove("tw-hidden");
          }
        } else if (type == 'right') {
          this.rightUrl = event.target.result;
          var ele = document.getElementById("right");
          var eleSvg = document.getElementById("rightSvg");
          var pSvg = document.getElementById("pRight");
          var p1Svg = document.getElementById("pRight1");

          if (ele != null && eleSvg != null && pSvg != null && p1Svg != null) {
            eleSvg.classList.add("tw-hidden");
            pSvg.classList.add("tw-hidden");
            p1Svg.classList.add("tw-hidden");
            ele.classList.remove("tw-hidden");
          }
        } else if (type == 'registration') {
          this.registrationUrl = event.target.result;
          var ele = document.getElementById("registration");
          var eleSvg = document.getElementById("registrationSvg");
          var pSvg = document.getElementById("pRegistration");
          var p1Svg = document.getElementById("pRegistration1");

          if (ele != null && eleSvg != null && pSvg != null && p1Svg != null) {
            eleSvg.classList.add("tw-hidden");
            pSvg.classList.add("tw-hidden");
            p1Svg.classList.add("tw-hidden");
            ele.classList.remove("tw-hidden");
          }
        } else if (type == 'inspection') {
          this.inspectionUrl = event.target.result;
          var ele = document.getElementById("inspection");
          var eleSvg = document.getElementById("inspectionSvg");
          var pSvg = document.getElementById("pInspection");
          var p1Svg = document.getElementById("pInspection1");

          if (ele != null && eleSvg != null && pSvg != null && p1Svg != null) {
            eleSvg.classList.add("tw-hidden");
            pSvg.classList.add("tw-hidden");
            p1Svg.classList.add("tw-hidden");
            ele.classList.remove("tw-hidden");
          }
        } else if (type == 'insurance') {
          this.insuranceUrl = event.target.result;
          var ele = document.getElementById("insurance");
          var eleSvg = document.getElementById("insuranceSvg");
          var pSvg = document.getElementById("pInsurance");
          var p1Svg = document.getElementById("pInsurance1");

          if (ele != null && eleSvg != null && pSvg != null && p1Svg != null) {
            eleSvg.classList.add("tw-hidden");
            pSvg.classList.add("tw-hidden");
            p1Svg.classList.add("tw-hidden");
            ele.classList.remove("tw-hidden");
          }
        }
      }
      if (type == 'front')
        reader.readAsDataURL(this.frontImg.nativeElement.files[0]);
      else if (type == 'back')
        reader.readAsDataURL(this.backImg.nativeElement.files[0]);
      else if (type == 'left')
        reader.readAsDataURL(this.leftImg.nativeElement.files[0]);
      else if (type == 'right')
        reader.readAsDataURL(this.rightImg.nativeElement.files[0]);
      else if (type == 'registration')
        reader.readAsDataURL(this.registrationImg.nativeElement.files[0]);
      else if (type == 'inspection')
        reader.readAsDataURL(this.inspectionImg.nativeElement.files[0]);
      else if (type == 'insurance')
        reader.readAsDataURL(this.insuranceImg.nativeElement.files[0]);
    }
    else {
      Swal.fire({
        title: 'Confirmation',
        html: 'Please input an image',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'No',
        confirmButtonColor: '#007bff',
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    } 

  }


  submit() {
    var message: string = '';
    if (!(this.mileage >= 10 && this.mileage <= 1000)) {
      message = "Mileage must be in range 10 to 1000";
    } else if (this.chooseWard == "0" && this.latF == 0 && this.lngF == 0) {
      message = "Please fill a location for your car";
    } else if (this.frontImgFile == undefined) {
      message = "Please fill a front image for your car";
    } else if (this.backImgFile == undefined) {
      message = "Please fill a back image for your car";
    } else if (this.leftImgFile == undefined) {
      message = "Please fill a left image for your car";
    } else if (this.rightImgFile == undefined) {
      message = "Please fill a right image for your car";
    } else if (this.registrationImgFile == undefined) {
      message = "Please fill a registration image for your car";
    } else if (this.inspectionImgFile == undefined) {
      message = "Please fill a inspection image for your car";
    } else if (!(this.cancelPending >= 1 && this.cancelPending <= 48)) {
      message = "Cancel pending is only from 1 hour to 48 hour";
    } else if (!(this.cancelPendingDeposit >= 1 && this.cancelPendingDeposit <= 48)) {
      message = "Cancel pending for deposit is only from 1 hour to 48 hour";
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
    } else {
      if (this.insuranceImgFile == undefined) {
        Swal.fire({
          title: 'Confirmation',
          html: 'You have not filled in the insurance image, this may reduced the booking on this car. Do you still want to continue ?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Continue',
          cancelButtonText: 'No',
          confirmButtonColor: '#007bff',
        }).then((result) => {
          if (result.isConfirmed) {
            this.submitForm();
          }
        });
      } else {
        this.submitForm();
      }
    }


  }

  submitForm() {
    var location: FormCarLocation = {
      wardId: Number(this.chooseWard),
      road: this.saveRoad,
      lat: this.latF,
      lng: this.lngF
    }
    this.formCarDetail = {
      mileage: this.mileage,
      location: [location],
      frontImgFile: this.frontImgFile,
      backImgFile: this.backImgFile,
      leftImgFile: this.leftImgFile,
      rightImgFile: this.rightImgFile,
      registrationImgFile: this.registrationImgFile,
      inspectionImgFile: this.inspectionImgFile,
      insuranceImgFile: this.insuranceImgFile,
      timeCancelPending: this.cancelPending,
      timeCancelPendingDeposit: this.cancelPendingDeposit,
      frontUrl: this.frontUrl,
      backUrl: this.backUrl,
      leftUrl: this.leftUrl,
      rightUrl: this.rightUrl,
      registrationUrl: this.registrationUrl,
      inspectionUrl: this.inspectionUrl,
      insuranceUrl: this.insuranceUrl,
      road: this.road
    }
    this.sendFormCarDetail.emit(this.formCarDetail);
    this.updateData.emit('2');

  }

  previousStep() {
    var location: FormCarLocation = {
      wardId: Number(this.chooseWard),
      road: this.saveRoad,
      lat: this.latF,
      lng: this.lngF,
    }
    this.formCarDetail = {
      mileage: this.mileage,
      location: [location],
      frontImgFile: this.frontImgFile,
      backImgFile: this.backImgFile,
      leftImgFile: this.leftImgFile,
      rightImgFile: this.rightImgFile,
      registrationImgFile: this.registrationImgFile,
      inspectionImgFile: this.inspectionImgFile,
      insuranceImgFile: this.insuranceImgFile,
      timeCancelPending: this.cancelPending,
      timeCancelPendingDeposit: this.cancelPendingDeposit,
      frontUrl: this.frontUrl,
      backUrl: this.backUrl,
      leftUrl: this.leftUrl,
      rightUrl: this.rightUrl,
      registrationUrl: this.registrationUrl,
      inspectionUrl: this.inspectionUrl,
      insuranceUrl: this.insuranceUrl,
      road: this.road
    }
    this.sendFormCarDetail.emit(this.formCarDetail);
    this.updateData.emit('0');
  }
}
