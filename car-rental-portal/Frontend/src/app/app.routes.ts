import {VerifyComponent} from './components/verify/verify.component';
import {SearchcarComponent} from "./components/searchcar/searchcar.component";
import {
    ForgotPasswordDialogComponent
} from "./components/authentication/forgot-password-dialog/forgot-password-dialog.component";
import {HomepageCustomersComponent} from "./components/homepage-customers/homepage-customers.component";
import {Error404Component} from './shared/error/Error404/Error404.component';
import {Error403Component} from './shared/error/Error403/Error403.component';
import {LoginComponent} from './components/authentication/login/login.component';
import {RegisterComponent} from './components/authentication/register/register.component';
import {ResetPasswordComponent} from './components/authentication/reset-password/reset-password.component';
import {BookingModule} from './components/booking/create-booking/booking.module';
import {BookingDetailsModule} from './components/booking/booking-details/booking-details.module';
import {CarDetailComponent} from "./components/car-detail/car-detail.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {MybookingComponent} from "./components/mybooking/mybooking.component";
import {Routes} from '@angular/router';
import {TestComponent} from './components/test/test.component';
import {BookingDetailComponent} from './shared/components/booking-detail/booking-detail.component';
import {CarBookingComponent} from "./components/car-booking/car-booking.component";
import {MyCarComponent} from "./components/my-car/my-car.component";
import {PaymentComponent} from "./components/payment/payment.component";
import {AddCarComponent} from "./components/add-car/add-car.component";
import {WalletComponent} from "./components/wallet/wallet.component";
import {ViewCarOwnerComponent} from "./components/view-car-owner/view-car-owner.component";
import { CarManageComponent } from './components/car-manage/car-manage.component';
import FeedbackReportComponent from './components/feedback-report/feedback-report.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { ChangePasswordComponent } from './components/authentication/change-password/change-password.component';
import { TopUpComponent } from './components/top-up/top-up.component';

import { AuthGuard } from './components/authentication/_prevent-load/AuthGuard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      breadcrumb: 'Login'
    }
  },
  {
    path: 'payment/:type/:booking_id',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment/:type/:booking_id/:amount',
    component: PaymentComponent
  },
  {
    path: 'topup',
    component: TopUpComponent
  },
  {
    path: 'topup/:redirect',
    component: TopUpComponent
  },
  {
    path: 'login/:message',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      breadcrumb: 'Register'
    }
  },
  // {
  //   path: 'template',
  //   component: BookingDetailComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'test',
  //   component: TestComponent
  // },
  {
    path: 'car/detail/:id',
    component: CarDetailComponent,
  },
  {
    path: 'car-booking/:tab/:carId',
    component: CarBookingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'car-booking/:tab',
    component: CarBookingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-car',
    component: AddCarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'car-booking',
    component: CarBookingComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'car/detail/:id/:pick/:drop',
    component: CarDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
  },
  {
    path: 'mybooking',
    component: MybookingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-car',
    component: MyCarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-car/:id',
    component: ViewCarOwnerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mywallet',
    component: WalletComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'myprofile',
    component: MyProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mywallet/:amount',
    component: WalletComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'car-manage',
    component: CarManageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'feedback-report',
    component: FeedbackReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account/activate',
    component: VerifyComponent,
    data: {
      breadcrumb: null
    }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchcarComponent,
    data: {
      breadcrumb: 'search'
    }
  },
  {
    path: 'search/:city/:district/:ward/:pick/:drop',
    component: SearchcarComponent,
  },
  {
    path: 'account',
    data: {
      breadcrumb: null
    },
    children: [
      {
        path: 'reset',
        data: {
          breadcrumb: null
        },
        children: [
          {
            path: 'finish',
            component: ResetPasswordComponent,
            data: {
              breadcrumb: null
            }
          },
        ],
      },
      {
        path: 'forgotPassword',
        component: ForgotPasswordDialogComponent,
        data: {
          breadcrumb: null
        }
      },
    ],
  },
  {
    path: 'home',
    component: HomepageCustomersComponent,
    data: {
      breadcrumb: 'Home'
    }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'booking',
    loadChildren: () => BookingModule,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Booking'
    }
  },
  {
    path: 'my-bookings',
    loadChildren: () => BookingDetailsModule,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'My Bookings'
    }
  },
  {
    path: '403',
    component: Error403Component,
  },
  {
    path: '404',
    component: Error404Component,
  },
  {
    path: '**',
    component: Error404Component,
  },

];
