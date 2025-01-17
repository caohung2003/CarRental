import { Routes } from "@angular/router";
import { AuthGuard } from "../../../authorization/auth.guard";
import { BookingFinishComponent } from "../booking-finish/booking-finish.component";
import { BookingComponent } from "../booking/booking.component";
import { CreateBookingUIComponent } from "../create-booking-ui/create-booking-ui.component";

export const routes: Routes = [
  {
    path: ':carId/:pickUpDate/:returnDate/:city/:district/:ward/:street',
    component: CreateBookingUIComponent,
    // canActivate: [AuthGuard],
    data: {
      breadcrumb: null
    },
  },
  {
    path: ':carId/:pickUpDate/:returnDate/:city/:district/:ward',
    component: CreateBookingUIComponent,
    // canActivate: [AuthGuard],
    data: {
      breadcrumb: null
    },
  },
  {
    path: 'finish',
    component: BookingFinishComponent,
    // canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Finish'
    },
  }
];