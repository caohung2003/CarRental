import { MbscModule } from '@mobiscroll/angular';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {
  ForgotPasswordDialogComponent
} from './components/authentication/forgot-password-dialog/forgot-password-dialog.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AsyncPipe, CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './services/auth.service';
import {MapComponent} from "./components/map/map.component";
import {ListCarCardComponent} from "./components/map/list-car-card/list-car-card.component";
import {CarListViewComponent} from "./components/car-list-view/car-list-view.component";
import {RatingViewCarComponent} from "./components/rating/rating-view-car/rating-view-car.component";
import {PaginationComponent} from "./shared/components/pagination/pagination.component";
import {MyCarComponent} from "./components/my-car/my-car.component";
import {TabComponent} from "./shared/components/tab/tab.component";
import {AddCarComponent} from "./components/add-car/add-car.component";
import {CarBookingComponent} from "./components/car-booking/car-booking.component";
import {RatingUserComponent} from "./components/rating/rating-user/rating-user.component";
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [MbscModule, RouterOutlet, RouterModule, CommonModule, HttpClientModule, FormsModule, StoreModule, ForgotPasswordDialogComponent, MapComponent, ListCarCardComponent, CarListViewComponent, RatingViewCarComponent, PaginationComponent, MyCarComponent, TabComponent, AddCarComponent, CarBookingComponent, RatingUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    AsyncPipe,
    NgbActiveModal,
    AuthService
  ]
})
export class AppComponent implements OnInit , AfterViewInit {

  title = 'CarRental';
  constructor(private router: Router) {
  }
  ngAfterViewInit(): void {
    initFlowbite();

  }
  ngOnInit(): void {
    initFlowbite();
  }






}

