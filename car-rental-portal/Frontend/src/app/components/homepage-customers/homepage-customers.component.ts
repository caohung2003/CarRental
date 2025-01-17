import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from '../../shared/header/header.component';
import {CarBasic} from '../../models/interfaces/carbasic';
import {CarService} from '../../services/car.service';
import {CommonModule} from '@angular/common';
import {LocationService} from '../../services/location.service';
import {Router, RouterLink} from '@angular/router';
import {Location} from '../../models/interfaces/location';
import {HTTP_INTERCEPTORS, HttpErrorResponse} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {FooterComponent} from '../../shared/footer/footer.component';
import {TokenInterceptor} from '../authentication/_prevent-load/TokenInteceptor';
import {MapComponent} from "../map/map.component";
// import H from "@here/maps-api-for-javascript";
import {MapService} from "../../services/map.service";
import {DataService} from "../../services/data.service";
import {SearchCar} from "../../models/interfaces/search-car";
import {ErrorsService} from '../../services/errors.service';

@Component({
  selector: 'app-homepage-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, MapComponent, RouterLink],
  templateUrl: './homepage-customers.component.html',
  styleUrl: './homepage-customers.component.css',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class HomepageCustomersComponent implements OnInit {
  public cars: CarBasic[] = [];
  public carCount: Map<String, number> = new Map;
  public cities: Location[] = [];
  public districts: Location[] = [];
  public wards: Location[] = [];
  public pick: Date = new Date();
  public drop: Date = new Date(new Date().setDate(new Date().getDate() + 2));

  public chooseWard: string = "0";
  public chooseCity: string = "0";
  public chooseDistrict: string = "0";
  public mapMode = false;

  public firstPick: string = "";
  public firstDrop: string = "";

  public location: string = "";
  public road: string = "";


  constructor(private carService: CarService,
              private locationService: LocationService,
              private route: Router,
              private mapService: MapService,
              private dataService:DataService,
              private errorService: ErrorsService) {
    this.zoom = 2;
    this.lat = 0;
    this.lng = 0;
  }
  latF: number;
  lngF: number;
  zoom: number;
  lat: number;
  lng: number;
  @ViewChild('targetDiv') targetDiv: ElementRef | undefined;


  closeMap(location: string) {
    var c = "1";
    var d = "1";
    var w = "1";
    if (location != '') {
      for (let i = 0; i < location.length; i++) {
        if (location[i] == ',') {
          this.latF = Number(location.slice(0, i));
          this.lngF  = Number(location.slice(i + 2));
        }
      }
      this.mapService.getLocationByLatAndLng(this.latF , this.lngF).subscribe(
        (response: any) => {
          c = "Thành phố " + response.items[0].address.county
          d = response.items[0].address.city;
          w = response.items[0].address.district;
          var a = response.items[0].title;
          this.road = a;
          this.specialLoad(c, d, w);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    }
    this.mapMode = false;''
  }

  removeDiacritics(inputString: string): string {
    var a: string = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if(a.includes("Thanh pho")) {
      a = a.replace("Thanh pho", "");
    }
    else if(a.includes("Tinh")) {
      a = a.replace("Tinh", "");
    }
    else if(a.includes("Quan")) {
      a = a.replace("Quan", "");
    }
    else if(a.includes("Huyen")) {
      a = a.replace("Huyen", "");
    }
    else if(a.includes("Thi xa")) {
      a = a.replace("Thi xa", "");
    }
    else if(a.includes("Phuong")) {
      a = a.replace("Phuong", "");
    }
    else if(a.includes("Xa")) {
      a = a.replace("Xa", "");
    }
    a = a.trim();
    if(a == "Thua Thien-Hue") {
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
          if(this.removeDiacritics(response[i].cityName) == this.removeDiacritics(city)) {
            cChoose = true;
            this.chooseCity = response[i].cityCode;
            this.districts = [];
            this.locationService.getAllDistrictsByCityCode(this.chooseCity).subscribe(
              (response: any) => {
                for (let j = 0; j < response.length; j++) {
                  if(this.removeDiacritics(response[j].districtName) == this.removeDiacritics(district)) {
                    dChoose = true;
                    this.chooseDistrict = response[j].districtCode;
                    this.wards = [];
                    this.locationService.getAllWardsByCityCodeAndDistrictCode(this.chooseCity, this.chooseDistrict).subscribe(
                      (response: any) => {
                        for (let k = 0; k < response.length; k++) {
                          if(this.removeDiacritics(response[k].wardName) == this.removeDiacritics(ward.trim())) {
                            wChoose = true;
                            this.chooseWard = response[k].id;
                          }
                          if(!wChoose) {
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
                  if(!dChoose) {
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
          if(!cChoose) {
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


  ngOnInit(): void {
    this.loadData();

  }

  private loadData(): void {
    this.getCarFeauture();
    this.getCarCountByCity();

    this.firstPick = `${this.pick.getFullYear()}-${this.pick.getUTCMonth() + 1 < 10 ? "0" + (this.pick.getUTCMonth() + 1) : this.pick.getUTCMonth() + 1}-${this.pick.getDate() < 10 ? "0" + this.pick.getDate() : this.pick.getDate()}T${this.pick.getHours() < 10 ? "0" + this.pick.getHours() : this.pick.getHours()}:${this.pick.getMinutes() < 10 ? "0" + this.pick.getMinutes() : this.pick.getMinutes()}`;
    this.firstDrop = `${this.drop.getFullYear()}-${this.drop.getUTCMonth() + 1 < 10 ? "0" + (this.drop.getUTCMonth() + 1) : this.drop.getUTCMonth() + 1}-${this.drop.getDate() < 10 ? "0" + this.drop.getDate() : this.drop.getDate()}T${this.drop.getHours() < 10 ? "0" + this.drop.getHours() : this.drop.getHours()}:${this.drop.getMinutes() < 10 ? "0" + this.drop.getMinutes() : this.drop.getMinutes()}`;
    this.getAllCities();
    //this.getAllWardsByCityCodeAndDistrictCode(this.chooseCity, this.chooseDistrict);

  }


  getCarFeauture(): void {
    this.cars = [];
    this.carService.getFeautureCars().subscribe(
      (data: any) => {
        for (var i = 0; i < data.length; i++) {
          var locationCity: Location = {
            id: 0,
            code: "0",
            name: ", " + data[i].carLocations[0].ward.district.city.cityName
          }
          var locationDistrict: Location = {
            id: 0,
            code: "0",
            name: ", " + data[i].carLocations[0].ward.district.districtName
          }
          var locationWard: Location = {
            id: 0,
            code: "0",
            name: data[i].carLocations[0].ward.wardName
          }
          var car: CarBasic = {
            id: data[i].id,
            brand: data[i].brandModel.brand.name,
            model: data[i].brandModel.modelName,
            price: data[i].carPricing.basePrice,
            front: data[i].carDetail.frontImgUrl,
            back: data[i].carDetail.backImgUrl,
            left: data[i].carDetail.leftImgUrl,
            right: data[i].carDetail.rightImgUrl,
            rating: data[i].rating,
            seat: data[i].noSeat,
            location: [locationCity, locationDistrict, locationWard],
            transmission: data[i].transmission,
            rides: data[i].noRides,
            fuel: data[i].fuel,
            consumption: data[i].carDetail.fuelConsumption,
            mileage: data[i].carDetail.mileage,
            distance: 0,
            lat: 0,
            lng: 0,
            deposit: 0,
            description: '',
            features: [],
            terms: [],
            insurance_status: true
          }
          this.cars.push(car);
        }
      },
      (error) => {
        console.log('Error fetching data', error);
      }
    );
  }

  getCarCountByCity(): void {
    this.carService.getCarCountByCity().subscribe(
      (data: any) => {
        this.carCount = data;
      },
      error => {
        console.error('Error fetching car count by city:', error);
      }
    );
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


  public getAllDistrictsByCityCode(cityCode: String, type: String): void {
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

  public getAllWardsByCityCodeAndDistrictCode(cityCode: String, districtCode: String): void {
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

  @ViewChild('district') dtt: ElementRef | undefined;
  @ViewChild('ward') wrd: ElementRef | undefined;

  loadDistricts(city: HTMLSelectElement) {
    this.getAllDistrictsByCityCode(city.value, 'yes');
    if (city.value == "0") {
      if (this.dtt != null && this.wrd != null) {
        this.dtt.nativeElement.disabled = true;
        this.wrd.nativeElement.disabled = true;
        // this.district.nativeElement.value = "0";
      }
    } else {
      if (this.dtt != null && this.wrd != null) {
        this.dtt.nativeElement.disabled = false;
      }
    }
    this.chooseDistrict = "0";
    this.chooseWard = "0";
  }

  loadWards(city: HTMLSelectElement, district: HTMLSelectElement) {
    this.getAllWardsByCityCodeAndDistrictCode(city.value, district.value);
    if (district.value == "0") {
      if (this.wrd != null) {
        this.wrd.nativeElement.disabled = true;
        // this.district.nativeElement.value = "0";
      }
    } else {
      if (this.wrd != null) {
        this.wrd.nativeElement.disabled = false;
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

  search(searchForm: any) {
    const data: SearchCar = {
      city: this.chooseCity,
      district: this.chooseDistrict,
      ward: this.chooseWard,
      road: this.road,
      pickDate: searchForm.value.pick1,
      dropDate: searchForm.value.drop1,
      lat: this.latF,
      lng: this.lngF
    }
    this.dataService.setData(data);
    this.route.navigate(['/search'])
  }

  openMap() {
    var a = document.getElementById("mp");
    if (a != null) {
      a.style.display = 'block';
      this.mapMode = true;
    }
  }

  convertLocation(loc: Location[]): string {
    let result = "";
    for (let i = loc.length-1; i >= 0; i--) {
      result += loc[i].name;
    }
    return result;
  }
}
