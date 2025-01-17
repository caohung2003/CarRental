import { Routes } from '@angular/router';
import { ViewEditBookingDetailsComponent } from '../view-edit-booking-details/view-edit-booking-details.component';

export const bookingDetailsRoutes: Routes = [
  {
    path: ':bookingId',
    component: ViewEditBookingDetailsComponent,
    //   canActivate: [AuthGuard],
    data: {
      breadcrumb: null,
    },
    // children: [
    //   {
    //     path: 'bookingInfo/:bookingId',
    //     component: ViewBookingDetailsInfoFormComponent,
    //   },
    //   {
    //     path: 'paymentInfo/:bookingId',
    //     component: ViewPaymentInfoComponent
    //   },
    //   {
    //     path: 'carInfo/:bookingId',
    //     component: ViewCarInfoComponent
    //   }
    // ],
  },
];
