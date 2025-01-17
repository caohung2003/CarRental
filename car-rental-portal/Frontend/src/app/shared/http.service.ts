import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { StorageService } from '../services/storage.service';
import { STORAGE_TOKEN } from '../constants/STORAGE-CONSTANT';

@Injectable({ providedIn: 'root' })
export class HttpService {
	private host: string;
	private hostImage: string;
	constructor(private http: HttpClient, private storageService: StorageService,
		private router: Router,
	) {
		this.host = environment.apiBaseUrl;
	}


	getToken() {
		return this.storageService.get(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY);
	}

	getRefreshToken() {
		return this.storageService.get(STORAGE_TOKEN.LOCAL_STORAGE_REFRESH_KEY);
	}

	buildHeaders(): any {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${this.getToken() != null && this.getToken() != "" ? this.getToken() : ""}`
		});
		return headers;

	}


	get(url: string) {
		return this.checkTokenAndCallEndPoint('GET', this.host + url, '');
	}
	post(url: string, data: any) {
		return this.checkTokenAndCallEndPoint('POST', this.host + url, data);
	}

	signOutAndGoToLoginPage() {
		this.storageService.isSessionExpired = true;
		this.router.navigate(['/login']);

	}

	postNoToken(url: string, data: any) {
		// console.log('url:::', url, data);
		// this.buildHeaders();
		return this.http.post(this.host + url, data, { observe: 'response' });
	}
	postNoTokenReturnBody(url: string, data: any) {
		//   console.log('url:::', url,data);
		// this.buildHeaders();
		return this.http.post(this.host + url, data, { observe: 'body' });
	}


	// getNoToken(url: string, data: string) {
	// 	console.log('url:', url);
	// 	return this.http.get(this.host + url);
	// }

	getNoTokenNew(url: string) {
		// console.log('url-----++:', this.host +url);
		return this.http.get(this.host + url);
	}

	// getNoToken(url: string, data: string) {
	// 	return this.callEndPoint('GET', this.host + url, data);
	// }

	put(url: string, data: any) {
		return this.checkTokenAndCallEndPoint('PUT', this.host + url, data);
	}

	patch(url: string, data: any) {
		return this.checkTokenAndCallEndPoint('PATCH', this.host + url, data);
	}

	delete(url: string) {
		return this.checkTokenAndCallEndPoint('DELETE', this.host + url, '');
	}

	checkTokenValidity() {
		this.buildHeaders();
		//this.authService.checkTokenValidity(this.buildHeaders());
	}

	private checkTokenAndCallEndPoint(verb: any, url: any, body: any) {
		return this.callEndPoint(verb, url, body);
		// if (!this.isTokenExpired()) {
		// 	return this.callEndPoint(verb, url, body);
		// } else {
		// 	//this.authService.clearLocalStorage();
		// 	// this.buildHeaders();

		// 	// return this.http.get<any>(this.host + endpoints.refresh, { headers: this.buildHeaders() }).subscribe({
		// 	// 	next: data => {
		// 	// 		this.storageService.put('id_token', data.access_token);
		// 	// 		this.storageService.isSessionExpired = false;
		// 	// 	},
		// 	// 	error: error => {
		// 	// 		console.error('There was an error!', error);
		// 	// 		if (error != undefined && error.status == HTTP_FORBIDDEN_STATUS) {
		// 	// 			this.signOutAndGoToLoginPage();
		// 	// 		}
		// 	// 	}
		// 	// });

		// 	return null;
		// }
	}

	getThirdPartyUrl(url: any) {
		return this.http.get(url);
		// return this.callEndPoint('GET', url, null);
	}

	postWithToken(url: any, data: any) {
		return this.checkTokenAndCallEndPoint('POST', this.host + url, data);
	}

	postWithRefreshToken(url: any, data: any) {
		return this.http.post(this.host + url, data, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.getRefreshToken() != null && this.getRefreshToken() != "" ? this.getRefreshToken() : ""}`
			})
		});
	}

	getWithTokenData(url: any, data: any) {
		return this.checkTokenAndCallEndPoint('GET', this.host + url, data);
	}
	getWithToken(url: string) {
		// console.log('url: ', url);
		return this.checkTokenAndCallEndPoint('GET', this.host + url, null);
	}

	getWithTokenResponseText(url: string) {
		// console.log('url: ', url);
		
		return this.callEndPointResponseText('GET', this.host + url, null);
	}



	putWithToken(url: string) {
		// console.log('url: ', url);
		return this.checkTokenAndCallEndPoint('PUT', this.host + url, "");
	}

	callEndPoint(verb: any, url: any, data: any) {
		// console.log('Header: ', this.buildHeaders());
		switch (verb) {
			case 'DELETE':
				return this.http.delete(url, { headers: this.buildHeaders() });
			case 'POST':
				return this.http.post(url, data, { headers: this.buildHeaders(), observe: 'body' });
			case 'PUT':
				return this.http.put(url, data, { headers: this.buildHeaders() });
			case 'PATCH':
				return this.http.patch(url, data, { headers: this.buildHeaders() });
			//get as default verb
			default:
				return this.http.get(url, { headers: this.buildHeaders() });
		}
	}

	callEndPointResponseText(verb: any, url: any, data: any) {
		// console.log('Header: ', this.buildHeaders());
		switch (verb) {
			case 'DELETE':
				return this.http.delete(url, { headers: this.buildHeaders(), responseType: 'text'});
			case 'POST':
				return this.http.post(url, data, { headers: this.buildHeaders(), responseType: 'text' });
			case 'PUT':
				return this.http.put(url, data, { headers: this.buildHeaders() , responseType: 'text'});
			case 'PATCH':
				return this.http.patch(url, data, { headers: this.buildHeaders() , responseType: 'text'});
			//get as default verb
			default:
				return this.http.get(url, { headers: this.buildHeaders() , responseType: 'text'});
		}
	}

	postWithTokenFormMulitpart(url: string, data: FormData) {
		//const token = localStorage.getItem('jwtToken');
		const httpOptionsForm = {
			headers: new HttpHeaders({
			})
		};
		httpOptionsForm.headers.set('enctype', 'multipart/form-data');
		httpOptionsForm.headers.set('Accept', 'charset=utf-8');
		httpOptionsForm.headers.set('Accept-Charset', 'charset=utf-8');
		console.log('POST:' + this.hostImage + url, data);
		return this.http.post(this.hostImage + url, data, httpOptionsForm);
	}
	extractData(res: Response) {
		let body = res.json();
		return body;
	}
}
