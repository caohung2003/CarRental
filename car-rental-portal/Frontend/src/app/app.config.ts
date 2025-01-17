import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { StoreModule, provideStore } from '@ngrx/store';
import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { reducers } from './storages/storage.reducers';
import { TokenInterceptor } from './components/authentication/_prevent-load/TokenInteceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    FormsModule,
    CommonModule,
    NgForm,
    BrowserModule,
    BrowserAnimationsModule,
    provideAnimations(),
    importProvidersFrom(StoreModule.forRoot({})),
    provideStore(reducers),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    },
    provideAnimations()
],
};
