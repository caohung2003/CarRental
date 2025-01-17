import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MapComponent} from "../../map/map.component";
import {NgForOf, NgIf} from "@angular/common";
import {FeatureService} from "../../../services/feature.service";
import {Feature} from "../../../models/interfaces/feature";
import Swal from "sweetalert2";
import {FormCarPricing} from "../../../models/interfaces/form-carpricing";
import {FormCarDetail} from "../../../models/interfaces/form-cardetail";

@Component({
  selector: 'app-form-car-pricing',
  standalone: true,
  imports: [
    FormsModule,
    MapComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './form-car-pricing.component.html',
  styleUrl: './form-car-pricing.component.css'
})
export class FormCarPricingComponent implements OnInit, OnChanges{
  public terms: Feature[];
  public basePrice: number = 1000000;
  public deposit: number = 0;
  public pickTerms: number[];
  @Input() mode: string = "";

  public pickTermsString: string[];
  @Input() public formCarPricing: FormCarPricing;
  @Output() updateData: EventEmitter<string> = new EventEmitter();
  @Output() sendFormCarPricing: EventEmitter<FormCarPricing> = new EventEmitter();

  constructor(private featureService: FeatureService) {
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



  previousStep() {
    var message: string = '';
    if (!(this.basePrice >= 500000 && this.basePrice <= 100000000)) {
      message = 'Base price per day must between 500K and 100M';
    } else if (!(this.deposit >= 0 && this.deposit <= 15000000)) {
      message = 'Deposit must between 0 and 15M';
    }
    if (message != '') {
      Swal.fire({
        title: 'Confirmation',
        html: message,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Continue',
        confirmButtonColor: '#007bff',
      }).then((result) => {
      });
    } else {
      this.pickTerms = [];
      this.pickTermsString = [];
      for (let i = 0; i < this.terms.length; i++) {
        var a = document.getElementById(this.terms[i].id.toString()) as HTMLInputElement;
        if (a != null) {
          if (a.checked) {
            this.pickTerms.push(this.terms[i].id);
            this.pickTermsString.push(this.terms[i].name);
          }
        }
      }
      this.formCarPricing = {
        basePrice: this.basePrice ,
        deposit: this.deposit ,
        priceMethod: 'NOT_BONUS_HALF_DAY',
        terms: this.pickTerms,
        termsString: this.pickTermsString
      }
      this.sendFormCarPricing.emit(this.formCarPricing);
      this.updateData.emit('1');
    }
  }

  submit() {
    var message: string = '';
    if (!(this.basePrice >= 500000 && this.basePrice <= 100000000)) {
      message = 'Base price per day must between 500K and 100M';
    } else if (!(this.deposit >= 0 && this.deposit <= 15000000)) {
      message = 'Deposit must between 0 and 15M';
    }
    if (message != '') {
      Swal.fire({
        title: 'Confirmation',
        html: message,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Continue',
        confirmButtonColor: '#007bff',
      }).then((result) => {
      });
    } else {
      this.pickTerms = [];
      this.pickTermsString = [];
      for (let i = 0; i < this.terms.length; i++) {
        var a = document.getElementById(this.terms[i].id.toString()) as HTMLInputElement;
        if (a != null) {
          if (a.checked) {
            this.pickTerms.push(this.terms[i].id);
            this.pickTermsString.push(this.terms[i].name);
          }
        }
      }
      this.formCarPricing = {
        basePrice: this.basePrice ,
        deposit: this.deposit ,
        priceMethod: 'NOT_BONUS_HALF_DAY',
        terms: this.pickTerms,
        termsString: this.pickTermsString
      }
      this.sendFormCarPricing.emit(this.formCarPricing);
      this.updateData.emit('3');
    }
  }

  getAllTerms() {
    this.terms = [];
    this.featureService.getAllFeatureByFeatureType('Term').subscribe(
      (response: any) => {
        for (let i = 0; i < response.length; i++) {
          var a: Feature = {
            id: response[i].id,
            name: response[i].featureName,
            type: response[i].featureType
          }
          this.terms.push(a);
        }
      }
    )
  }

  ngOnInit(): void {
    console.log(this.formCarPricing);
    this.getAllTerms();
    window.scrollTo({top: 0, behavior: 'smooth'});
    if(this.formCarPricing != null) {
      this.pickTerms = this.formCarPricing.terms;
      this.basePrice = this.formCarPricing.basePrice ;
      this.deposit = this.formCarPricing.deposit ;
      this.pickTermsString = this.formCarPricing.termsString;
    }
  }
}
