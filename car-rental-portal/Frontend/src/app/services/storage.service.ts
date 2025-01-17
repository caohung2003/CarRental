import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

declare var _: any;

@Injectable({ providedIn: 'root' })
export class StorageService {

	isSessionExpired: boolean = false;
	private localStorage;
	constructor(@Inject(DOCUMENT) private document: Document) {
		this.localStorage = document.defaultView?.localStorage;
	}

	put(key: string, value: any) {
		if (this.localStorage == null) {
			return;
		}
		this.localStorage.removeItem(key);

		if (value instanceof Object) {
			this.localStorage.setItem(key, JSON.stringify(value));
		} else {
			this.localStorage.setItem(key, value);
		}
	}

	get(key: string) {
		try {
			return JSON.parse(this.localStorage?.getItem(key)!);
		} catch (e) {
			return this.localStorage?.getItem(key);
		}

	}

	remove(key: string) {
		this.localStorage?.removeItem(key);
	}

	set(key: string, value: string) {
		this.localStorage?.setItem(key, value);
	}
}
