import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import onResize from 'simple-element-resize-detector';
import {MapService} from "../../services/map.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgClass} from "@angular/common";
import {AutoCompleteModule} from "primeng/autocomplete";
import {Observable} from 'rxjs/internal/Observable';
import {startWith} from 'rxjs/internal/operators/startWith';
import {map} from 'rxjs/internal/operators/map';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Maps} from "../../models/interfaces/map";
import {Location} from "../../models/interfaces/location";
import {SearchcarService} from "../../services/searchcar.service";
import {CarBasic} from "../../models/interfaces/carbasic";
import {LocationCar} from "../../models/interfaces/location-car";
import {ListCarCardComponent} from "./list-car-card/list-car-card.component";



interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

export class State {
  constructor(public name: string, public population: string, public flag: string) {
  }
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgClass,
    ReactiveFormsModule,
    AutoCompleteModule,
    MatFormField,
    MatLabel,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatInputModule,
    MatSlideToggle,
    ListCarCardComponent
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue'
      })),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class MapComponent implements OnInit {
  public H = window['H'];
  private map?: H.Map;
  @Output() notify = new EventEmitter();
  @ViewChild('map') mapDiv?: ElementRef;
  @Input() public zoom = 2;
  @Input() public lat = 0;
  @Input() public lng = 0;
  @Input() public mapMode = true;
  private timeoutHandle: any;
  @Output() updateData: EventEmitter<string> = new EventEmitter();

  public latF: any = 21.028511;

  public lngF: any = 105.804817;
  public clickMarker: H.map.Marker | undefined;
  public cars: CarBasic[] = [];
  public userTap: any;

  myControl = new FormControl();
  options: Maps[] = [];
  loc: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  constructor(private mapService: MapService, private searchCarService: SearchcarService) {


  }

  public locationCar: LocationCar[] = [];

  public landmarks = [

    {name: 'Ha Noi', lat: 21.0006733, lng: 105.5374341, label: 'CA', data: 'dawa'},
    {name: 'Ha Noi', lat: 21.0006733, lng: 105.5374341, label: 'DA', data: 'esrs'},
  ];
  formGroup: any;


  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  @ViewChild("search") inp: ElementRef | undefined;

  private _filter(value: string): Maps[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.location.toLowerCase().includes(filterValue))

  }


  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
           this.latF = resp.coords.latitude;
           this.lngF = resp.coords.longitude;
          // //console.log(resp.coords.latitude + " " + resp.coords.longitude);
           resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          resolve(err);
        });
    });
  }


  ngAfterViewInit(): void {
    this.getPosition().then(pos => {
      if (pos.lng != undefined && pos.lat != undefined) {
        this.lngF = pos.lng;
        this.latF = pos.lat;
        this.landmarks[0].lng = pos.lng;
        this.landmarks[0].lat = pos.lat;
        this.mapService.getLocationByLatAndLng(this.latF, this.lngF).subscribe(
          (response: any) => {
            (document.getElementById("title") as Element).innerHTML = response.items[0].title;
            (document.getElementById("address") as Element).innerHTML =
              response.items[0].address.district + ", " +
              response.items[0].address.city + ", " +
              "Thành phố " + response.items[0].address.county + ", " +
              response.items[0].address.countryName


          },
          (error: HttpErrorResponse) => {
          }
        )
      }

      if (!this.map && this.mapDiv) {
        // Instantiate a platform, default layers and a map as usual.
        const platform: H.service.Platform = new H.service.Platform({
          apikey: 'uMr3fUqwW98SKgEF-9ulIGIBLdmpahpgLhlap-dSXNU'
         // apikey: 'BaXsJAOd9g0nBq1UFsCTvMhJuEsMHPt4DFVsfZ-4ykI'

        });
        const layers = platform.createDefaultLayers();
        const map = new H.Map(
          this.mapDiv.nativeElement,
          (layers as any).vector.normal.map,
          {
            pixelRatio: window.devicePixelRatio,
            // In this example, the map centers on
            // Luxembourg City, with the zoom level of 16:
            zoom: 20,
            center: {lat: this.latF, lng: this.lngF}
          },
        );
        var marker: H.map.Marker;
        // For each marker, select the icon based on the corresponding landmark label:
        var icon = new H.map.Icon('../assets/images/marker-' + this.landmarks[0].label + '.png',
          // Adjust the marker size to your needs:

          {
            size: {w: 45, h: 45}
          });
        marker = new H.map.Marker({lat: this.landmarks[0].lat, lng: this.landmarks[0].lng},
          {data: "800K", icon: icon});
        map.addObject(marker);
        icon = new H.map.Icon('../assets/images/marker-' + this.landmarks[1].label + '.png',
          // Adjust the marker size to your needs:
          {
            size: {w: 45, h: 45}
          });
        this.clickMarker = new H.map.Marker({lat: this.landmarks[1].lat, lng: this.landmarks[1].lng},
          {data: this.landmarks[1].name, icon: icon});
        map.addObject(this.clickMarker);

        onResize(this.mapDiv.nativeElement, () => {
          map.getViewPort().resize();

        });
        // map.addEventListener('mapviewchange', (ev: H.map) => {
        //   this.notify.emit(ev)
        //
        // });
        map.addEventListener('tap', (evt: any) => {
          if(this.userTap == undefined || this.userTap != evt.target) {
            if (evt.currentPointer) {
              var coord = map.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);
             // console.log("tapOut");
              if (coord?.lat != null) {
                this.mapService.getLocationByLatAndLng(coord.lat, coord.lng).subscribe(
                  (response: any) => {
                    (document.getElementById("title") as Element).innerHTML = response.items[0].title;
                    (document.getElementById("address") as Element).innerHTML =
                      response.items[0].address.district + ", " +
                      response.items[0].address.city + ", " +
                      "Thành phố " + response.items[0].address.county + ", " +
                      response.items[0].address.countryName
                  },
                  (error: HttpErrorResponse) => {
                  }
                );
                if (!this.arr.includes(coord?.lat + " " + coord?.lng)) {
                  if (this.clickMarker != undefined)
                    map.removeObject(this.clickMarker);
                  this.landmarks[1].name = (document.getElementById("title") as Element).innerHTML;
                  this.landmarks[1].lat = coord.lat;
                  this.landmarks[1].lng = coord.lng;
                  const icon = new H.map.Icon('../assets/images/marker-' + this.landmarks[1].label + '.png',
                    // Adjust the marker size to your needs:
                    {
                      size: {w: 45, h: 45},
                    });
                  // var icon = new H.map.Icon('<img src = "../assets/images/marker-CA.png"' + '/>' + '<div style="color: green; z-index: 10000000000"> 1 xe' + '</div>');
                  this.clickMarker = new H.map.Marker({lat: this.landmarks[1].lat, lng: this.landmarks[1].lng},
                    {data: this.landmarks[1].name, icon: icon});
                  this.clickMarker.setData("da");
                  map.addObject(this.clickMarker)
                  if(this.userTap != undefined) {
                  //  console.log("Tap but not car");
                    this.crs.nativeElement.style.display = 'none';
                    var iconCar = new H.map.Icon(
                      '../assets/images/car/car-icon.png',
                      // Adjust the marker size to your needs:
                      {
                        size: {w: 45, h: 45}
                      });
                    map.removeObject(this.userTap);
                    this.userTap.setIcon(iconCar);
                    map?.addObject(this.userTap);
                  }
                }
              }
            }
          }
          //console.log(this.userTap);
        });
        this.addCarLocationMarker(map);
        new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        this.map = map;
      }
    });
  }


  loadOption(search: HTMLInputElement) {
    clearTimeout(this.timeoutHandle);
    if (search.value != '') {
      this.timeoutHandle = setTimeout(() => {
        this.mapService.autocomplete(search.value).subscribe(
          (response: any) => {
            for (let i = 0; i < response.features.length; i++) {
              if (!this.loc.includes(response.features[i].properties.formatted)) {
                var map: Maps = {
                  location: response.features[i].properties.formatted,
                  lat: response.features[i].geometry.coordinates[1],
                  lng: response.features[i].geometry.coordinates[0]
                }
                this.options.push(map);
                console.log(this.options);
                this.loc.push(response.features[i].properties.formatted);
              }
            }
          }
          // this.options = arr;
          //this._filter(search.value);
          // console.log(this.options);

        )
      }, 0);

    }
  }

  loadCenter(inp: HTMLInputElement) {
    var lat = 0, lng = 0;
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].location == inp.value) {
        lat = (Number)(this.options[i].lat);
        lng = (Number)(this.options[i].lng);
      }
    }
    this.mapService.getLocationByLatAndLng(lat, lng).subscribe(
      (response: any) => {
        (document.getElementById("title") as Element).innerHTML = response.items[0].title;
        (document.getElementById("address") as Element).innerHTML =
          response.items[0].address.district + ", " +
          response.items[0].address.city + ", " +
          "Thành phố " + response.items[0].address.county + ", " +
          response.items[0].address.countryName
      }
    )
    if (this.clickMarker != undefined)
      this.map?.removeObject(this.clickMarker);
    this.clickMarker = new H.map.Marker({lat: lat, lng});
    this.landmarks[1].name = (document.getElementById("title") as Element).innerHTML;
    this.landmarks[1].lat = lat;
    this.landmarks[1].lng = lng;
    // For each marker, select the icon based on the corresponding landmark label:
    const icon = new H.map.Icon('../assets/images/marker-' + this.landmarks[1].label + '.png',
      // Adjust the marker size to your needs:
      {
        size: {w: 45, h: 45}
      });
    this.clickMarker = new H.map.Marker({lat: this.landmarks[1].lat, lng: this.landmarks[1].lng},
      {data: this.landmarks[1].name, icon: icon});
    this.map?.addObject(this.clickMarker);
    this.map?.setCenter({
      lat: lat,
      lng: lng
    })
  }

  closeMap() {
    // this.mapMode = false;
    this.updateData.emit("");
    var a = document.getElementById("mp");
    if (a != null) {
      a.style.display = 'none';
    }
  }

  public arr: string[] = [];
  @ViewChild("cardiv") crs: ElementRef;
  addCarLocationMarker(map: H.Map): void {
    var carMarker: H.map.Marker, iconCar;
    this.searchCarService.allCarLocation().subscribe(
      (response: any) => {
        for (let i = 0; i < response.length; i++) {
          var locationCity: Location = {
            id: 0,
            code: "0",
            name: response[i].ward.district.city.cityName
          }
          var locationDistrict: Location = {
            id: 0,
            code: "0",
            name: ", " + response[i].ward.district.districtName
          }
          var locationWard: Location = {
            id: 0,
            code: "0",
            name: ", " + response[i].ward.wardName + (response[i].road != null ? (", " + response[i].road): (""))
          }
          var car: CarBasic = {
            id: response[i].carId,
            front: response[i].frontImgUrl,
            back: response[i].backImgUrl,
            left: response[i].leftImgUrl,
            right: response[i].rightImgUrl,
            brand: response[i].brandName,
            model: response[i].modelName,
            rating: response[i].rating,
            seat: response[i].noSeat,
            price: response[i].basePrice,
            location: [locationCity, locationDistrict, locationWard],
            transmission: response[i].transmission,
            rides: response[i].noRides,
            fuel: response[i].fuel,
            consumption: response[i].fuelConsumption,
            mileage: response[i].mileage,
            distance: 0,
            lat: response[i].lat,
            lng: response[i].lng,
            description: '',
            features: [],
            terms: [],
            deposit: 0,
            insurance_status: true

          }
          if (!this.arr.includes(response[i].lat + " " + response[i].lng)) {
            this.locationCar.push({
              location: response[i].lat + " " + response[i].lng,
              cars: [car]
            })
            this.arr.push(response[i].lat + " " + response[i].lng);
            this.cars.push(car);
            iconCar = new H.map.Icon(
              '../assets/images/car/car-icon.png',
              // Adjust the marker size to your needs:
              {
                size: {w: 45, h: 45}
              });
            carMarker = new H.map.Marker({lat: response[i].lat, lng: response[i].lng},
              {data: response[i].lat + " " + response[i].lng, icon: iconCar});
            carMarker.addEventListener('tap', (evt: any) => {
              this.crs.nativeElement.style.display = 'flex';
              if(this.userTap != undefined) {

                var iconCar = new H.map.Icon(
                  '../assets/images/car/car-icon.png',
                  // Adjust the marker size to your needs:
                  {
                    size: {w: 45, h: 45}
                  });
                map.removeObject(this.userTap);
                this.userTap.setIcon(iconCar);
                map?.addObject(this.userTap);
              }
              for (let j = 0; j < this.locationCar.length; j++) {
                if(this.locationCar[j].location === evt.target.getData()) {
                 // console.log(this.locationCar[j]);
                    this.cars = this.locationCar[j].cars;
                  (document.getElementById("title") as Element).innerHTML = "";
                  (document.getElementById("address") as Element).innerHTML = "";
                  for (let k = 0; k < this.locationCar[j].cars[0].location.length; k++) {
                    (document.getElementById("address") as Element).innerHTML += this.locationCar[j].cars[0].location[k].name;
                    (document.getElementById("title") as Element).innerHTML += this.locationCar[j].cars[0].location[k].name;

                  }
                }

              }
              this.userTap = evt.target;
              //console.log("tapIn");
              // if (this.clickMarker != undefined) {
              //   map.removeObject(this.clickMarker);
              // }
              var iconCarClick = new H.map.Icon(
                '../assets/images/car/car-icon-click.png',
                // Adjust the marker size to your needs:
                {
                  size: {w: 45, h: 45}
                });
              map.removeObject(evt.target);
              evt.target.setIcon(iconCarClick);
              map?.addObject(evt.target);
            });
            map.addObject(carMarker);

          }
          else {
            for (let j = 0; j < this.locationCar.length; j++) {
              if(this.locationCar[j].location === response[i].lat + " " + response[i].lng) {
                this.locationCar[j].cars.push(car);
              }
            }
          }
        }
      }
    )
  }

  chooseLocation(current: string) {
    if (current == 'current') {
      this.updateData.emit(this.landmarks[0].lat + ", " + this.landmarks[0].lng);
    } else {
      this.updateData.emit(this.landmarks[1].lat + ", " + this.landmarks[1].lng);
    }
    var a = document.getElementById("mp");
    if (a != null) {
      a.style.display = 'none';
    }
  }
}
