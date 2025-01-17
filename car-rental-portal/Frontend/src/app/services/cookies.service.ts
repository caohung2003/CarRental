import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor(private cookieService: CookieService) { }

  setCookie(key: string, value: any, _time?: number) {
    this.cookieService.set(key, value, _time);
  }

  getCookie(key: string): any {
    const cookieValue = this.cookieService.get(key);
    return cookieValue;
  }

  deleteCookie(key: string) {
    this.cookieService.delete(key);
  }
}
