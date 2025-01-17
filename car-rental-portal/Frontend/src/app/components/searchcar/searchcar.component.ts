import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Location } from "../../models/interfaces/location";
import { CarBasic } from "../../models/interfaces/carbasic";
import { LocationService } from "../../services/location.service";
import { SearchcarService } from "../../services/searchcar.service";
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSliderModule } from "@angular/material/slider";
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { DataService } from '../../services/data.service';
import { MapComponent } from "../map/map.component";
import H from "@here/maps-api-for-javascript";
import { MapService } from "../../services/map.service";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';

type JsonPrimitive = string | number | boolean | null

export interface Model {
  id: number,
  name: string
}

interface JsonMap extends Record<string, JsonPrimitive | JsonArray | JsonMap> {
}

interface JsonArray extends Array<JsonPrimitive | JsonArray | JsonMap> {
}

type Json = JsonPrimitive | JsonMap | JsonArray

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    MatSliderModule,
    HeaderComponent,
    FooterComponent,
    MapComponent,
    LoadingComponent,
    CommonModule,
    CarouselComponent
  ],
  templateUrl: './searchcar.component.html',
  styleUrl: './searchcar.component.css',
  animations: [
    trigger('toggleDisplay', [
      state('hidden', style({
        display: 'none',
        opacity: 0,
      })),
      state('visible', style({
        display: 'flex',
        opacity: 1,
      })),
      transition('hidden <=> visible', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class SearchcarComponent {
  isLoading: boolean = true;
  public cities: Location[] = [];
  public districts: Location[] = [];
  public wards: Location[] = [];
  public results: CarBasic[] = [];
  public size: number = 6;
  public page: number = 0;
  public totalPage: number = 0;
  public total: number = 0;
  public slideIndex: number = 1;
  public arrPage: Array<number> = [];
  public srt: Array<Json> = [];
  public displayState: string = 'hidden';

  public distance: number = 50;

  public location: string = "";
  public road: string = "";
  public pick: Date = new Date();
  public drop: Date = new Date(new Date().setDate(new Date().getDate() + 2));
  public sort: string = "";
  public brandModel: Model[] = [];
  public brand: any = null;
  public transmission: any = null;
  public fuel: any = null;
  public seats: any = null;
  public plus = false;

  public chooseSeat: string = "0";
  public chooseFuel: string = "0";
  public chooseTransmission: string = "0";
  public chooseBrand: string = "0";
  public choosePrice: string = "0";

  public chooseWard: string = "0";
  public chooseCity: string = "0";
  public chooseDistrict: string = "0";

  public grid: boolean = true;

  public fromPrice: any = 0;

  public toPrice: any = 10000;

  public oldResult: any;

  public firstPick: string = "";
  public firstDrop: string = "";

  public city: string = "0";
  public district: string = "0";
  public ward: string = "0";

  public lat: number = 0;
  public lng: number = 0;
  public zoom: number = 0;
  public mapMode = false;

  constructor(private locationService: LocationService,
    private searchCarService: SearchcarService,
    private route: Router,
    private routeParam: ActivatedRoute,
    private dataService: DataService,
    private mapService: MapService) {
    this.slideMin();
    this.slideMax();
    this.setArea();
  }

  closeMap(location: string) {
    document.getElementById("da")?.click();
    var c = "1";
    var d = "1";
    var w = "1";
    if (location != '') {
      for (let i = 0; i < location.length; i++) {
        if (location[i] == ',') {
          this.lat = Number(location.slice(0, i));
          this.lng = Number(location.slice(i + 2));
        }
      }
      this.mapService.getLocationByLatAndLng(this.lat, this.lng).subscribe(
        (response: any) => {
          c = "Thành phố " + response.items[0].address.county
          d = response.items[0].address.city;
          w = response.items[0].address.district;
          var a = response.items[0].title;
          this.road = a;
          this.specialLoad(c, d, w)
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    }
    this.mapMode = false;
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
                    // if (this.dtt != null) {
                    //   this.dtt.nativeElement.disabled = false;
                    // }
                    this.wards = [];
                    this.locationService.getAllWardsByCityCodeAndDistrictCode(this.chooseCity, this.chooseDistrict).subscribe(
                      (response: any) => {
                        for (let k = 0; k < response.length; k++) {
                          if (this.removeDiacritics(response[k].wardName) == this.removeDiacritics(ward.trim())) {
                            wChoose = true;
                            this.chooseWard = response[k].id;
                            // if (this.wrd != null) {
                            //   this.wrd.nativeElement.disabled = false;
                            // }
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

  handleInputChange(event: Event) {
    const target = <HTMLInputElement>event.target;
    if (target) {
      if (target.name === 'zoom') {
        this.zoom = parseFloat(target.value);
      }
      if (target.name === 'lat') {
        this.lat = parseFloat(target.value);
      }
      if (target.name === 'lng') {
        this.lng = parseFloat(target.value);
      }
    }
  }

  handleMapChange(event: H.map.ChangeEvent) {
    if (event.newValue.lookAt) {
      const lookAt = event.newValue.lookAt;
      this.zoom = lookAt.zoom;
      this.lat = lookAt.position.lat;
      this.lng = lookAt.position.lng;
    }
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  public getAllCities(): void {
    this.locationService.getAllCities().subscribe(
      (response: any) => {
        for (let i = 0; i < response.length; i++) {
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


  public getAllDistrictsByCityCode(cityCode: string, type: string): void {
    this.districts = [];
    if (type == 'yes') {
      this.locationService.getAllDistrictsByCityCode(cityCode).subscribe(
        (response: any) => {
          for (let i = 0; i < response.length; i++) {

            var location: Location = {
              id: response[i].id,
              code: response[i].districtCode,
              name: response[i].districtName
            }
            this.districts.push(location);
          }
        },
      )
    } else {
      this.locationService.getAllDistrictsByCityCode(cityCode).subscribe(
        (response: any) => {
          for (let i = 0; i < response.length; i++) {
            var location: Location = {
              id: response[i].id,
              code: response[i].districtCode,
              name: response[i].districtName
            }
            this.districts.push(location);
          }
        },
      )
    }
  }

  public getAllWardsByCityCodeAndDistrictCode(cityCode: string, districtCode: string): void {
    this.wards = [];
    this.locationService.getAllWardsByCityCodeAndDistrictCode(cityCode, districtCode).subscribe(
      (response: any) => {
        for (let i = 0; i < response.length; i++) {
          var location: Location = {
            id: response[i].id,
            code: response[i].wardCode,
            name: response[i].wardName
          }

          this.wards.push(location);
        }
      }
    )
  }

  public getAllBrandModels() {
    this.brandModel = [];
    this.searchCarService.brandModel().subscribe(
      (response: any) => {
        for (const element of response) {
          this.brandModel.push({
            id: element.id,
            name: element.name
          });
        }
      }
    )
  }


  ngOnInit(): void {
    this.dataService.data$.subscribe((data) => {

      if (data != null) {
        this.pick = new Date(data.pickDate);
        this.firstPick = `${this.pick.getFullYear()}-${this.pick.getUTCMonth() + 1 < 10 ? "0" + (this.pick.getUTCMonth() + 1) : this.pick.getUTCMonth() + 1}-${this.pick.getDate() < 10 ? "0" + this.pick.getDate() : this.pick.getDate()}T${this.pick.getHours() < 10 ? "0" + this.pick.getHours() : this.pick.getHours()}:${this.pick.getMinutes() < 10 ? "0" + this.pick.getMinutes() : this.pick.getMinutes()}`;
        this.drop = new Date(data.dropDate);
        this.firstDrop = `${this.drop.getFullYear()}-${this.drop.getUTCMonth() + 1 < 10 ? "0" + (this.drop.getUTCMonth() + 1) : this.drop.getUTCMonth() + 1}-${this.drop.getDate() < 10 ? "0" + this.drop.getDate() : this.drop.getDate()}T${this.drop.getHours() < 10 ? "0" + this.drop.getHours() : this.drop.getHours()}:${this.drop.getMinutes() < 10 ? "0" + this.drop.getMinutes() : this.drop.getMinutes()}`;

        this.chooseCity = data.city;
        this.chooseDistrict = data.district;
        this.chooseWard = data.ward;
        if (this.dtt != undefined) {
          this.dtt.nativeElement.value = this.chooseDistrict;

        }
        if (this.wrd != undefined) {
          this.wrd.nativeElement.value = this.chooseWard;
        }
        this.getAllCities();
        this.getAllDistrictsByCityCode(this.chooseCity, 'not');
        this.getAllWardsByCityCodeAndDistrictCode(this.chooseCity, this.chooseDistrict);
        this.city = data.city;
        this.district = data.district;
        this.ward = data.ward;
        this.road = data.road;
        this.lat = data.lat;
        this.lng = data.lng;

        if (this.city != '0') {
          // if (this.dtt != null) {
          //
          //   this.dtt.nativeElement.disabled = false;
          // }
        } else {
          if (this.dtt != null && this.wrd != null) {
            this.dtt.nativeElement.disabled = true;
            this.wrd.nativeElement.disabled = true;
          }
        }
        if (this.district != '0') {
          // if (this.wrd != null) {
          //   this.wrd.nativeElement.disabled = false;
          // }
        } else {
          if (this.wrd != null) {
            this.wrd.nativeElement.disabled = true;
          }
        }
        this.location = data.road;
        // this.getAllDistrictsByCityCode(this.cities[0].code);
        this.getAllBrandModels();
        this.getResultsSearch();
      } else {
        this.firstPick = `${this.pick.getFullYear()}-${this.pick.getUTCMonth() + 1 < 10 ? "0" + (this.pick.getUTCMonth() + 1) : this.pick.getUTCMonth() + 1}-${this.pick.getDate() < 10 ? "0" + this.pick.getDate() : this.pick.getDate()}T${this.pick.getHours() < 10 ? "0" + this.pick.getHours() : this.pick.getHours()}:${this.pick.getMinutes() < 10 ? "0" + this.pick.getMinutes() : this.pick.getMinutes()}`;
        this.firstDrop = `${this.drop.getFullYear()}-${this.drop.getUTCMonth() + 1 < 10 ? "0" + (this.drop.getUTCMonth() + 1) : this.drop.getUTCMonth() + 1}-${this.drop.getDate() < 10 ? "0" + this.drop.getDate() : this.drop.getDate()}T${this.drop.getHours() < 10 ? "0" + this.drop.getHours() : this.drop.getHours()}:${this.drop.getMinutes() < 10 ? "0" + this.drop.getMinutes() : this.drop.getMinutes()}`;
        this.getAllCities();
        //this.getAllWardsByCityCodeAndDistrictCode(this.chooseCity, this.chooseDistrict);
        this.getAllBrandModels();
        this.getResultsSearch();
        this.location = "All city";
      }
    });

  }

  @ViewChild('district') dtt: ElementRef | undefined;
  @ViewChild('ward') wrd: ElementRef | undefined;

  loadDistricts(city: HTMLSelectElement) {
    this.lat = 0;
    this.road = "";
    this.lng = 0;
    this.getAllDistrictsByCityCode(city.value, 'yes');
    if (city.value == "0") {
      if (this.dtt != null && this.wrd != null) {
        // this.dtt.nativeElement.disabled = true;
        // this.wrd.nativeElement.disabled = true;
        // this.district.nativeElement.value = "0";
      }
    } else {
      if (this.dtt != null && this.wrd != null) {
        // this.dtt.nativeElement.disabled = false;
      }
    }
    this.chooseDistrict = "0";
    this.chooseWard = "0";
  }

  loadWards(city: HTMLSelectElement, district: HTMLSelectElement) {
    this.lat = 0;
    this.road = "";
    this.lng = 0;
    this.getAllWardsByCityCodeAndDistrictCode(city.value, district.value);
    if (district.value == "0") {
      if (this.wrd != null) {
        //  this.wrd.nativeElement.disabled = true;
        // this.district.nativeElement.value = "0";
      }
    } else {
      if (this.wrd != null) {
        //this.wrd.nativeElement.disabled = false;
      }
    }
    this.chooseWard = "0";

  }

  alertErrorTime(pick: HTMLInputElement, drop: HTMLInputElement) {
    var pickDate: Date = new Date(pick.value);
    var dropDate: Date = new Date(drop.value);
    if (dropDate.getTime() - pickDate.getTime() <= 7200000) {
      var a = document.getElementById("ms");
      var btn = document.getElementById("btnSubmit");
      if (a != null) {
        a.textContent = "Rent time must larger than 2 hours";
        a.style.color = "red";
        if (btn != null) {
          btn.setAttribute("disabled", "disabled");
        }
      }
    } else {
      var a = document.getElementById("ms");
      var btn = document.getElementById("btnSubmit");
      if (a != null) {
        a.textContent = "";
        if (btn != null) {
          btn.removeAttribute("disabled");
        }
      }
    }
  }

  public getResultsSearch() {
    var location = '';
    var j = 0;
    this.searchCarService.search(this.distance, this.city, this.district, this.ward, this.plus, this.lat, this.lng, this.pick, this.drop, this.size, this.page, this.sort, this.brand, this.transmission, this.fuel, this.seats, this.fromPrice * 1000, this.toPrice * 1000)
      .subscribe(
        (response: any) => {
          console.log('rs search:', response);
          this.results = [];
          this.arrPage = [];
          console.log('rs:', response);
          this.total = response.totalElements;
          this.totalPage = response.totalPages;
          if (this.oldResult != response) {
            this.oldResult = response;
            for (let i = 0; i < response.totalPages; i++) {
              this.arrPage.push(i + 1);
            }
            for (const element of response.content) {
              var locationCity: Location = {
                id: 0,
                code: "0",
                name: ", " + element.ward.district.city.cityName
              }
              var locationDistrict: Location = {
                id: 0,
                code: "0",
                name: ", " + element.ward.district.districtName
              }
              var locationWard: Location = {
                id: 0,
                code: "0",
                name: element.ward.wardName
              }
              var carBasic: CarBasic = {
                id: element.carId,
                front: element.frontImgUrl,
                back: element.backImgUrl,
                left: element.leftImgUrl,
                right: element.rightImgUrl,
                brand: element.brandName,
                model: element.modelName,
                rating: element.rating,
                seat: element.noSeat,
                price: element.basePrice,
                location: [locationCity, locationDistrict, locationWard],
                transmission: element.transmission,
                rides: element.noRides,
                fuel: element.fuel,
                consumption: element.fuelConsumption,
                mileage: element.mileage,
                distance: Number(Number(element.distance / 1000).toFixed(1)),
                lat: element.lat,
                lng: element.lng,
                deposit: 0,
                description: '',
                features: [],
                terms: [],
                insurance_status: element.insuranceStatus
              }
              this.results.push(carBasic);
              // this.sortArr(this.results, carBasic);
            }
          }
        },
        (error) => {
          // Xử lý lỗi
        }
      )
  }

  public shiftOne(cars: CarBasic[], index: number, car: CarBasic) {
    var a = cars[index];
    for (let i = index + 1; i < cars.length; i++) {
      var b;
      b = cars[i];
      cars[i] = a;
      a = b;

    }
    cars[index] = car;
  }

  public sortArr(cars: CarBasic[], car: CarBasic): void {
    if (cars.length > 1) {
      var flag = false;
      for (let i = 0; i < cars.length - 1; i++) {
        if (car.distance <= cars[i].distance) {
          this.shiftOne(cars, i, car);
          break;
        }
      }
    }

  }

  public changeTag(arr: string[]): void {
    if (!document.getElementById("Automationtag")?.classList.contains("tw-hidden"))
      document.getElementById("Automationtag")?.classList.add("tw-hidden");

    if (!document.getElementById("Manualtag")?.classList.contains("tw-hidden"))
      document.getElementById("Manualtag")?.classList.add("tw-hidden");

    if (!document.getElementById("Gastag")?.classList.contains("tw-hidden"))
      document.getElementById("Gastag")?.classList.add("tw-hidden");

    if (!document.getElementById("Dieseltag")?.classList.contains("tw-hidden"))
      document.getElementById("Dieseltag")?.classList.add("tw-hidden");

    if (!document.getElementById("Seattag")?.classList.contains("tw-hidden"))
      document.getElementById("Seattag")?.classList.add("tw-hidden");

    if (!document.getElementById("Automationtag1")?.classList.contains("tw-hidden"))
      document.getElementById("Automationtag1")?.classList.add("tw-hidden");

    if (!document.getElementById("Manualtag1")?.classList.contains("tw-hidden"))
      document.getElementById("Manualtag1")?.classList.add("tw-hidden");

    if (!document.getElementById("Gastag1")?.classList.contains("tw-hidden"))
      document.getElementById("Gastag1")?.classList.add("tw-hidden");

    if (!document.getElementById("Dieseltag1")?.classList.contains("tw-hidden"))
      document.getElementById("Dieseltag1")?.classList.add("tw-hidden");

    if (!document.getElementById("Seattag1")?.classList.contains("tw-hidden"))
      document.getElementById("Seattag1")?.classList.add("tw-hidden");

    for (const element of arr) {
      if (document.getElementById(element)?.classList.contains("tw-hidden")) {
        document.getElementById(element)?.classList.remove("tw-hidden");
      }
      if (document.getElementById(element + "1")?.classList.contains("tw-hidden")) {
        document.getElementById(element + "1")?.classList.remove("tw-hidden");
      }
    }
  }


  search(searchForm: NgForm) {
    var arr: string[] = [];
    this.city = this.chooseCity;
    this.location = "";
    if (this.city != "0") {
      this.location += (document.getElementById("city") as HTMLSelectElement)?.selectedOptions[0].textContent;
    } else {
      this.location += "All city";
    }
    if (this.dtt != undefined) {
      if (this.dtt.nativeElement.value != '0')
        this.location += ", " + this.dtt.nativeElement.selectedOptions[0].textContent;
    }
    if (this.wrd != undefined) {
      if (this.wrd.nativeElement.value != '0')
        this.location += ", " + this.wrd.nativeElement.selectedOptions[0].textContent;
    }

    if (this.dtt != undefined)
      this.district = this.dtt.nativeElement.value;
    if (this.wrd != undefined)
      this.ward = this.wrd.nativeElement.value;
    this.road = searchForm.value.road;
    this.pick = new Date(searchForm.value.pick1.replace('T', ' '));
    this.drop = new Date(searchForm.value.drop1.replace('T', ' '));
    this.page = 0;
    this.getResultsSearch();
    //this.changeTag(arr);
  }

  // Next/previous controls
  public plusSlides(n: number, i: any, next: string) {
    this.showSlides(this.slideIndex += n, i, next);
  }

  public oldIndex: any;

  public showSlides(n: number, i: any, next: string) {
    if (this.slideIndex > 4) {
      this.slideIndex = 1;
    }
    if (this.oldIndex != i) {
      this.slideIndex = 1;
      this.oldIndex = i;
    }
    let slides = document.getElementsByClassName("mySlides" + i);
    if (slides != null) {
      if (n != this.slideIndex) {
        n = this.slideIndex;
        ``
      }
      if (n > 4) {
        this.slideIndex = 1;
      }
      if (n < 1) {
        this.slideIndex = slides.length;
      }
      for (const element of slides) {
        if (!element.classList.contains("hide")) {
          element.classList.add("hide");
          var a = element.querySelector('.numbertext');
          if (a != null) {
            switch (a.innerHTML) {
              case '1 / 4': {
                if (next == 'next') {
                  this.slideIndex = 2;
                } else {
                  this.slideIndex = 4;
                }
                break;
              }
              case '2 / 4': {
                if (next == 'next') {
                  this.slideIndex = 3;
                } else {
                  this.slideIndex = 1;
                }
                break;
              }
              case '3 / 4': {
                if (next == 'next') {
                  this.slideIndex = 4;
                } else {
                  this.slideIndex = 2;
                }
                break;
              }
              case '4 / 4': {
                if (next == 'next') {
                  this.slideIndex = 1;
                } else {
                  this.slideIndex = 3;
                }
                break;
              }
            }
          }
        }
      }
      slides[this.slideIndex - 1].classList.remove("hide");
    }
  }


  nextPage(i: number) {
    this.page = i - 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.getResultsSearch();
  }

  switchPage(p: number) {
    this.page = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getResultsSearch();
  }

  closeSort(id: string, name: string) {
    var e1 = document.getElementById(id + "V");
    var b = document.getElementById("img" + name) as HTMLImageElement;
    b.src = "";
    b.classList.add("tw-hidden");
    if (e1 != null) {
      e1.remove();
    }
    var e = document.getElementById(id);
    if (e != null) {
      e.remove();
    }
    if (this.sort.includes(name)) {
      if (this.sort.includes(name + "(asc)"))
        this.sort = this.sort.replace(name + "(asc)", "");
      else
        this.sort = this.sort.replace(name + "(desc)", "");

    }
    this.getResultsSearch();
  }

  changeSize(sizeForm: HTMLSelectElement) {
    this.size = Number(sizeForm.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.page = 0;
    this.getResultsSearch();
  }

  order(name: string) {
    console.log(name);
    var a = document.getElementById("sort" + name);
    var b = document.getElementById("img" + name) as HTMLImageElement;
    b.classList.remove('tw-hidden');
    if (a != null && b != null) {
      var nme = "";
      if (name == "ratings") {
        nme = 'Rating: ';
      } else if (name == "price") {
        nme = 'Price: ';
      } else if (name == "production") {
        nme = 'Model: ';
      } else if (name == "rides") {
        //console.log("Rhyder");
        nme = 'Rides: ';
      } else {
        nme = 'Distance: ';
      }
      console.log("1Name: " + nme);
      if (!this.sort.includes(name)) {
        if (this.sort.length > 0) {
          this.sort += ",";
        }

        this.sort += (name + "(asc)");
        var e = document.getElementById("srtEle");
        var msg = "";
        if (nme == 'Model: ') {
          msg = 'Newest to oldest';
        } else if (nme == 'Distance: ') {
          msg = 'Nearest to farest';
        } else {
          msg = 'Lowest to highest';
        }
        console.log("Name: " + nme);
        if (e != null) {
          e.insertAdjacentHTML('beforeend', '<div id="' + nme + '" class="tw-mr-2 tw-text-xs tw-inline-flex tw-items-center tw-font-bold tw-leading-sm tw-uppercase tw-px-3 tw-py-1 tw-bg-indigo-200 tw-text-gray-800 tw-rounded-full">' + nme + '&nbsp;<span id="' + (nme + "V") + '">' + (msg) + '</span>&nbsp;&nbsp;<img id="' + nme + "img" + '" class="tw-cursor-pointer tw-ml-1 tw-w-5" width="20px" src="../../../assets/images/icon/x-mark.png" /></div>');
        }
        var img = document.getElementById(nme + "img");
        if (img != null) {
          img.addEventListener('click', (e) => {
            this.closeSort(nme, name);
          })
        }
        b.src = "assets/images/icon/sort/sort-ascending.png";
      } else {
        if (this.sort.includes(name + "(asc)")) {
          this.sort = this.sort.replace(name + "(asc)", name + "(desc)");
          b.src = "assets/images/icon/sort/sort-descending.png";
          var e1 = document.getElementById(nme + "V");
          if (e1 != null) {
            if (e1.textContent == 'Newest to oldest') {
              e1.textContent = 'Oldest to newest';
            } else if (e1.textContent == 'Oldest to newest') {
              e1.textContent = 'Newest to oldest';
            } else if (e1.textContent == 'Lowest to highest') {
              e1.textContent = 'Highest to lowest';
            } else if (e1.textContent == 'Highest to lowest') {
              e1.textContent = 'Lowest to highest';
            } else if (e1.textContent == 'Nearest to farest') {
              e1.textContent = 'Farest to nearest';
            } else if (e1.textContent == 'Farest to nearest') {
              e1.textContent = 'Nearest to farest';
            }
          }
        } else {
          var e1 = document.getElementById(nme + "V");
          b.classList.add('tw-hidden');
          b.src = "";
          if (e1 != null) {
            e1.remove();
          }
          var e = document.getElementById(nme);
          if (e != null) {
            e.remove();
          }
          this.sort = this.sort.replace(name + "(desc)", "");
        }
      }

      console.log(this.sort);
      this.getResultsSearch();
    }
  }

  addTag(automation: string, id: string, searchForm: NgForm) {
    let element = document.getElementById(id) as HTMLInputElement;
    if (element != null) {
      if (automation.includes("seat")) {
        var tag = document.getElementById("Seattag");
        var span = document.getElementById("noseat");
        if (tag != null && span != null) {
          span.innerHTML = automation;

          automation = automation.replace(" seats", "");
          element.value = automation;
          this.chooseSeat = automation;
          this.seats = automation;
          tag.classList.remove("tw-hidden");
        }
      } else {
        element.value = automation;
        var tag = document.getElementById(automation + "tag");
        if (tag != null) {
          tag.classList.remove("tw-hidden");
        }
      }
      if (automation == 'Automation' || automation == 'Manual') {
        this.chooseTransmission = automation;
        this.transmission = automation;
      } else if (automation == 'Gas' || automation == 'Diesel') {
        this.fuel = automation;
        this.chooseFuel = automation;
      } else {
        this.seats = automation;
      }
      this.page = 0;
      this.getResultsSearch();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closetag(automationtag: string) {
    var element = document.getElementById(automationtag);
    if (element != null) {
      element.classList.add("tw-hidden");
    }
    if (automationtag == 'Cartag') {
      this.brand = null;
      this.chooseBrand = "0";
      let element = document.getElementById("brand") as HTMLInputElement;
      element.value = "0";
    } else if (automationtag == 'Pricetag') {
      this.choosePrice = "0";
      this.toPrice = 10000;
      this.fromPrice = 0;
    } else if (automationtag == 'Automationtag' || automationtag == 'Manualtag') {
      this.transmission = null;
      this.chooseTransmission = "0";
      let element = document.getElementById("transmission") as HTMLInputElement;
      element.value = "0";
    } else if (automationtag == 'Gastag' || automationtag == 'Dieseltag') {
      this.chooseFuel = "0";
      this.fuel = null;
      let element = document.getElementById("fuel") as HTMLInputElement;
      element.value = "0";
    } else {
      this.chooseSeat = "0";
      this.seats = null;
      let element = document.getElementById("seat") as HTMLInputElement;
      element.value = "0";
    }
    this.page = 0;
    this.getResultsSearch();
  }

  grid1(b: boolean) {
    this.grid = b;
  }

  filter(brand: HTMLSelectElement, name: string) {
    this.page = 0;
    var arr: string[] = [];
    switch (name) {
      case 'brand': {
        if (brand.value != "0") {
          this.brand = brand.value;
        } else {
          this.chooseBrand = "0";
          this.brand = null;
        }
        break;
      }
      case 'seat': {
        if (brand.value != "0") {
          this.seats = brand.value;
          this.chooseSeat = this.seats;
        } else {
          this.chooseSeat = "0";
          this.seats = null;
        }
        break;
      }
      case 'transmission': {
        if (brand.value != "0") {
          this.transmission = brand.value;
          this.chooseTransmission = this.transmission;
        } else {
          this.chooseTransmission = "0";
          this.transmission = null;
        }
        break;
      }
      case 'fuel': {
        if (brand.value != "0") {
          this.fuel = brand.value;
          this.chooseFuel = brand.value;
        } else {
          this.fuel = null;
          this.chooseFuel = "0";
        }
        break;
      }
      case 'price': {
        if (brand.value != "0") {
          this.fromPrice = (String)(brand.value).split('-')[0];
          this.toPrice = (String)(brand.value).split('-')[1];
          this.choosePrice = brand.value;
          arr.push('Pricetag');
          var ele = document.getElementById("pricevalue");
          if (ele != null) {
            switch (this.choosePrice) {
              case '0-1000': {
                ele.innerHTML = 'Smaller than 1000K/day'
                break;
              }
              case '1000-2000': {
                ele.innerHTML = 'From 1000K/day to 2000K/day'
                break;
              }
              case '2000-1000000': {
                ele.innerHTML = 'Greater than 2000K/day'
                break;
              }
            }
          }
        } else {
          this.fromPrice = null;
          this.toPrice = null;
          this.choosePrice = "0";
          var ele = document.getElementById("Pricetag");
          if (ele != null) {
            ele.classList.add("tw-hidden");
          }

        }
        break;
      }
    }

  }

  @ViewChild("brand") brnd: ElementRef | undefined;

  clear() {
    this.city = "0";
    this.district = "0";
    this.ward = "0";
    var arr: string[] = [];

    var ele = document.getElementById("Cartag");
    if (ele != null) {
      if (!ele.classList.contains("tw-hidden"))
        ele.classList.add("tw-hidden");
    }
    ele = document.getElementById("Pricetag");
    if (ele != null) {
      if (!ele.classList.contains("tw-hidden"))
        ele.classList.add("tw-hidden");
    }

    ele = document.getElementById("Automationtag");
    if (ele != null) {
      if (!ele.classList.contains("tw-hidden"))
        ele.classList.add("tw-hidden");
    }

    ele = document.getElementById("Manualtag");
    if (ele != null) {
      if (!ele.classList.contains("tw-hidden"))
        ele.classList.add("tw-hidden");
    }

    ele = document.getElementById("Gastag");
    if (ele != null) {
      if (!ele.classList.contains("tw-hidden"))
        ele.classList.add("tw-hidden");
    }

    ele = document.getElementById("Dieseltag");
    if (ele != null) {
      if (!ele.classList.contains("tw-hidden"))
        ele.classList.add("tw-hidden");
    }

    ele = document.getElementById("Seattag");
    if (ele != null) {
      if (!ele.classList.contains("tw-hidden"))
        ele.classList.add("tw-hidden");
    }
    this.brand = null;
    this.chooseBrand = "0";
    var element = document.getElementById("brand") as HTMLInputElement;
    element.value = "0";


    this.chooseFuel = "0";
    this.fuel = null;


    this.transmission = null;
    this.chooseTransmission = "0";

    this.seats = null;
    this.chooseSeat = "0";


    this.fromPrice = 0;
    this.toPrice = 10000;
    // ele = document.getElementById("Pricetag");
    // if (ele != null) {
    //   ele.classList.add("hide");
    // }
    // element = document.getElementById("price") as HTMLInputElement;
    // element.value = "0";

    this.page = 0;
    console.log(this.brand + " " + this.chooseBrand);
    this.getResultsSearch();
    //this.changeTag(arr);
  }


  getBrandById(id: any) {
    return this.brandModel.find(x => x.id == id)?.name;
  }

  submitFilter(filterForm: NgForm) {
    var arr: string[] = [];
    console.log("distance: " + filterForm.value.distance);
    if (filterForm.value.brand != 0) {
      arr.push('Cartag');
      this.brand = filterForm.value.brand;
      var brand = document.getElementById("carbrand");
      if (brand != null)
        brand.innerHTML = this.getBrandById(filterForm.value.brand) ?? '';
    } else {
      var ele = document.getElementById("Cartag");
      if (ele != null) {
        ele.classList.add("tw-hidden");
      }
      this.brand = null;
      this.chooseBrand = "0";
      let element = document.getElementById("brand") as HTMLInputElement;
      element.value = "0";
      this.brand = null;
    }
    if (filterForm.value.fuel != 0) {
      this.fuel = filterForm.value.fuel;
      if (this.fuel == 'Gas') {
        arr.push('Gastag');
      } else {
        arr.push('Dieseltag');
      }
    } else {
      this.chooseFuel = "0";
      this.fuel = null;
    }
    if (filterForm.value.transmission != 0) {
      this.transmission = filterForm.value.transmission;
      if (this.transmission == 'Automation') {
        arr.push('Automationtag');
      } else {
        arr.push('Manualtag');
      }
    } else {
      this.transmission = null;
    }
    if (filterForm.value.seats != 0) {
      if (filterForm.value.seats == '14+') {
        this.plus = true;
        this.seats = 14;
      } else {
        this.seats = filterForm.value.seats;
        this.plus = false;
      }
      arr.push('Seattag');
      var span = document.getElementById("noseat");
      var span1 = document.getElementById("noseat1");
      if (span != null)
        span.innerHTML = this.seats + " seats";
      if (span1 != null)
        span1.innerHTML = this.seats + " seats";
    } else {
      this.seats = null;

    }
    if (this.fromPrice != 0 || this.toPrice != 10000) {
      // this.fromPrice = filterForm.value.fromPrice;
      // this.toPrice = filterForm.value.toPrice;
      // arr.push('Pricetag');
      var ele = document.getElementById("pricevalue");
      if (ele != null) {
        ele.innerHTML = this.fromPrice + 'K - ' + this.toPrice + 'K';
      }
      var ele2 = document.getElementById("Pricetag");
      if (ele2 != null) {
        ele2.classList.remove("tw-hidden");
      }
    } else {
      var ele = document.getElementById("Pricetag");
      if (ele != null) {
        ele.classList.add("tw-hidden");
      }

    }
    console.log(this.brand + " " + this.chooseBrand);
    this.page = 0;
    this.getResultsSearch();
    this.changeTag(arr);
  }

  sortCar(sort: HTMLSelectElement) {
    if (sort.value == 'Ratings') {
      this.order('ratings');
    } else if (sort.value == 'Price') {
      this.order('price');
    } else if (sort.value == 'Model') {
      this.order('production');
    } else if (sort.value == 'Rides') {
      this.order('rides');
    }
  }


  toggleDropdown() {
    this.displayState = (this.displayState === 'hidden') ? 'visible' : 'hidden';
    // var a = document.getElementById("color-menu");
    // if(a != null) {
    //   if(a.style.display == 'none') {
    //     a.style.display = 'flex';
    //   }
    //   else {
    //     a.style.display = 'none';
    //   }
    // }
  }

  openMap() {
    var a = document.getElementById("mp");
    if (a != null) {
      a.style.display = 'block';
      this.mapMode = true;
    }
    document.getElementById("da")?.click();
  }

  formatLabelDistance(value: number): string {
    if (value >= 1000) {
      return Math.round(value) + 'km';
    }
    return `${value}km`;
  }

  // Xử lý việc đóng dropdown khi click ngoài

  changeWard() {
    this.lat = 0;
    this.road = "";
    this.lng = 0;
  }


  detail(id: number) {
    this.firstPick = `${this.pick.getFullYear()}-${this.pick.getUTCMonth() + 1 < 10 ? "0" + (this.pick.getUTCMonth() + 1) : this.pick.getUTCMonth() + 1}-${this.pick.getDate() < 10 ? "0" + this.pick.getDate() : this.pick.getDate()}T${this.pick.getHours() < 10 ? "0" + this.pick.getHours() : this.pick.getHours()}:${this.pick.getMinutes() < 10 ? "0" + this.pick.getMinutes() : this.pick.getMinutes()}`;
    this.firstDrop = `${this.drop.getFullYear()}-${this.drop.getUTCMonth() + 1 < 10 ? "0" + (this.drop.getUTCMonth() + 1) : this.drop.getUTCMonth() + 1}-${this.drop.getDate() < 10 ? "0" + this.drop.getDate() : this.drop.getDate()}T${this.drop.getHours() < 10 ? "0" + this.drop.getHours() : this.drop.getHours()}:${this.drop.getMinutes() < 10 ? "0" + this.drop.getMinutes() : this.drop.getMinutes()}`;

    window.open(this.route.createUrlTree(['/car/detail/' + id + "/" + this.firstPick + "/" + this.firstDrop], { queryParams: {} }).toString(), '_blank');
  }

  redirect(link: string) {
    this.route.navigate([link]);
  }

  convertLocation(loc: Location[]): string {
    let result = "";
    for (let i = loc.length-1; i >= 0; i--) {
      result += loc[i].name;
    }
    return result;
  }

  @ViewChild('dropdown') dropdown!: ElementRef;
  isShow = false;
  @HostListener('document:click', ['$event.target'])
  onClick(target: any) {
    const clickedInside = this.dropdown.nativeElement.contains(target);
    if (!clickedInside) {
      this.isShow = false;
    }
  }

  show() {
    this.isShow = !this.isShow;
  }

  minTrackLeft: number = 0;
  maxTrackRight: number = 0;
  sliderMinValue: number = 0;
  sliderMaxValue: number = 10000;
  step: number = 100;

  slideMin() {
    if (this.toPrice < this.fromPrice) {
      this.toPrice = this.fromPrice;
    }
    this.setArea();
  }

  slideMax() {
    if (this.toPrice < this.fromPrice) {
      this.fromPrice = this.toPrice;
    }
    this.setArea();
  }

  setArea() {
    this.minTrackLeft = ((this.fromPrice - this.sliderMinValue) / (this.sliderMaxValue - this.sliderMinValue)) * 100;
    this.maxTrackRight = ((this.sliderMaxValue - this.toPrice) / (this.sliderMaxValue - this.sliderMinValue)) * 100;
  }
}
