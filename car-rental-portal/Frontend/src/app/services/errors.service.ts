import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2'
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
//import { HTTP_UNAUTHORIZED_STATUS,HTTP_ERR_SESSION_EXPIRED, HTTP_ERR_SERVER_DOWN } from '../constants/http.status.codes';

@Injectable({ providedIn: 'root' })
export class ErrorsService {

	constructor(
		private authService: AuthService,
		private http: HttpClient
	) {

	}

	emitErrorMessage(err: any) {
		var msg: any = {};
		msg['type'] = 'ERROR';
		if (!err) {
			msg['message'] = 'Uknown Error';
			msg['title'] = 'Error';
			Swal.fire(msg['title'], msg['message'], 'error');
			return;
		}
		console.log('err.status', err.status);
		if (err.status != null && err.status == '0') {
			msg['title'] = 'You are Offline';
			msg['message'] = 'Check Your Internet Connection';
			Swal.fire(msg['title'], msg['message'], 'error');
			return;
		}
		try {
			console.log('emitErrorMessage::', err);
		} catch (e) {

		}

		msg['title'] = "Error";
		if (err.message) {
			msg['message'] = err.message;
		}
		if (err.error && err.error.error) {
			msg['message'] = err.error.error;
		}

		if (err.error && err.error.message) {
			msg['message'] = err.error.message;
		}
		if (err.error && err.error.length > 0) {
			msg['message'] = err.error[0].response;
		}

		if (msg['message'] == null && err.code && err.response) {
			msg['message'] = err.code + err.response;
		} else if (msg['message'] == null && err) {
			msg['message'] = err;
		}

		Swal.fire(msg['title'], msg['message'], 'error');

	}
	emitPlainErrorMessage(err: any) {
		var msg: any = {};
		msg['type'] = 'error';
		msg['title'] = "Error";
		msg['message'] = err;
		//   console.log(" messageEmitter called for message ::: "+msg);
		Swal.fire(msg['title'], msg['message'], msg['type']);

	}

	emitSuccessMessage(message: any) {
		var msg: any = {};
		msg['type'] = 'success';
		msg['TITLE'] = "SUCCESS";
		msg['message'] = message;
		Swal.fire(msg['title'], msg['message'], msg['type']);
	}

	emitWariningMessage(message: any) {
		var msg: any = {};
		msg['type'] = 'warning';
		msg['TITLE'] = "WARNING";
		msg['message'] = message;
		Swal.fire(msg['title'], msg['message'], msg['type']);
	}
	emitImageError(url?: string) {
		Swal.fire({
			imageUrl: url,
			imageAlt: 'The uploaded picture',
			showConfirmButton: false
		})
	}
	handleErrorShowErrorMsg(error: any) {
		console.log('error::', error);
		if (!error) {
			return;
		}
		this.handleErrorStatus(error.status);
		this.emitErrorMessage(error);
	}
	handleErrorShowErrorMsgWithTopError(error: any) {
		console.log('error::', error);
		if (!error) {
			return;
		}
		this.handleErrorStatus(error.status);
		this.emitErrorMessage(error);
	}

	handleErrorUndefinedShowErrorMsgWithTopError() {
		this.handleErrorStatus(403);
		this.emitErrorMessage("Unknown Error");
	}

	handleErrorShowStatusMsg(error: any) {
		console.log('error::', error);
		if (!error) {
			return;
		}
		this.handleErrorStatusShowMsg(error.status);
	}

	handleErrorStatus(status: number,) {
		var statusStr = status + '';
		console.log('status::', status);
		if (status == null) {
			//statusStr = HTTP_ERR_SESSION_EXPIRED;
		}


		// if (HTTP_ERR_SERVER_DOWN === statusStr) {
		// 	return;
		// }

	}
	emitWarningMessage(message: any) {
		var msg: any = {};
		msg['type'] = 'warning';
		msg['TITLE'] = "WARNING";
		msg['message'] = message;
		Swal.fire(msg['title'], msg['message'], msg['type']);
	}

	handleErrorStatusShowMsg(status: number) {
		console.log('status::', status);
		this.handleErrorStatus(status);
		this.emitPlainErrorMessage("Error " + status);
	}

	showSwalToastMessage(iconType: SweetAlertIcon, text: string,
		pos?: SweetAlertPosition, _timer?: number) {
		const Toast = Swal.mixin({
			toast: true,
			position: pos ? pos : 'top-end',
			showConfirmButton: false,
			showCloseButton: true,
			timer: _timer ? _timer : 1500,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer)
				toast.addEventListener('mouseleave', Swal.resumeTimer)
			}
		})

		Toast.fire({
			icon: iconType,
			title: text
		});
	}

	showModalAlert(iconType: SweetAlertIcon, title: string, content: string, _timer?: number) {
		Swal.fire({
			title: title,
			text: content,
			icon: iconType,
			timer: _timer,
			showConfirmButton: false
		});
	}

	showModalForgotWithApi() {
		Swal.fire({
			title: "Enter your email",
			input: "email",
			inputAttributes: {
				autocapitalize: "off"
			},
			position: 'top',
			confirmButtonText: "Confirm",
			confirmButtonColor: "rgb(13, 150, 242)",
			showLoaderOnConfirm: true,
			preConfirm: (email) => {
				console.log('email:' + email);
				this.authService.forgetPwd(email).subscribe(
					() => {
						Swal.fire('', 'Email authentication successful. Please check your email to reset password', 'success');
						// Handle response
					},
					() => {
						Swal.fire('', 'Your account does not exist. Please check your email again', 'error');
						// Handle error
					}
				);
			},
			allowOutsideClick: () => !Swal.isLoading()
		}).then((result) => {
			if (result.isConfirmed) {
				// Swal.fire({
				// 	title: 'Loading',
				// 	html: 'Please wait...',
				// 	allowEscapeKey: false,
				// 	allowOutsideClick: false,
				// 	didOpen: () => {
				// 		Swal.showLoading()
				// 	}
				// });
				this.loading();
			}
		});
	}

	showModalConfirm(): Promise<boolean> {
		return new Promise((resolve) => {
			let confirmButtonDisabled = true;
			let timerInterval: NodeJS.Timeout | undefined;

			Swal.fire({
				title: "Are you sure?",
				text: "You won't be able to revert this!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Waiting",
				timer: 10000,
				didOpen: () => {
					const confirmButton = Swal.getConfirmButton();
					if (confirmButton && confirmButtonDisabled) {
						confirmButton.setAttribute("disabled", "");
					}

					let secondsLeft = 5;
					timerInterval = setInterval(() => {
						if (secondsLeft <= 0) {
							clearInterval(timerInterval);
							confirmButtonDisabled = false;
							if (confirmButton) {
								confirmButton.removeAttribute("disabled");
								confirmButton.innerText = "Continue";
							}
						}
						if (confirmButton && confirmButtonDisabled) {
							confirmButton.innerText = `Waiting (${secondsLeft}s)`;
						}
						secondsLeft--;
					}, 1000);
				},
				willClose: () => {
					clearInterval(timerInterval);
				}
			}).then((result) => {
				if (result.isConfirmed) {
					resolve(true); // Resolve with true if confirmed
				} else {
					resolve(false); // Resolve with false if cancelled
				}
			});
		});
	}


	loading() {
		let codehtml = '<div class="loader" style="height: 100px;"><svg class="car" width="102" height="40" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 1)" stroke="#002742" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path class="car__body" d="M47.293 2.375C52.927.792 54.017.805 54.017.805c2.613-.445 6.838-.337 9.42.237l8.381 1.863c2.59.576 6.164 2.606 7.98 4.531l6.348 6.732 6.245 1.877c3.098.508 5.609 3.431 5.609 6.507v4.206c0 .29-2.536 4.189-5.687 4.189H36.808c-2.655 0-4.34-2.1-3.688-4.67 0 0 3.71-19.944 14.173-23.902zM36.5 15.5h54.01" stroke-width="3" /><ellipse class="car__wheel--left" stroke-width="3.2" fill="#FFF" cx="83.493" cy="30.25" rx="6.922" ry="6.808" /><ellipse class="car__wheel--right" stroke-width="3.2" fill="#FFF" cx="46.511" cy="30.25" rx="6.922" ry="6.808" /><path class="car__line car__line--top" d="M22.5 16.5H2.475" stroke-width="3" /><path class="car__line car__line--middle" d="M20.5 23.5H.4755" stroke-width="3" /><path class="car__line car__line--bottom" d="M25.5 9.5h-19" stroke-width="3" /></g></svg><h4 style="margin-left: 5px; color: rgb(13, 150, 242);"></h4></div>';
		Swal.fire({
			title: "Loading",
			html: 'Please wait...' + codehtml,
			allowOutsideClick: false,
			showConfirmButton: false,
			// didOpen: () => {
			// 	Swal.showLoading()
			// }
		});
	}

	hideSwal() {
		Swal.close();
	}

}
