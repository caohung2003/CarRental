import {FormCarLocation} from "./form-carlocation";

export interface FormCarDetail {
  mileage: number,
  location: FormCarLocation[],
  frontImgFile: any,
  backImgFile: any,
  leftImgFile: any,
  rightImgFile: any,
  registrationImgFile: any,
  inspectionImgFile: any,
  insuranceImgFile: any,
  timeCancelPending: number,
  timeCancelPendingDeposit: number,
  frontUrl: any,
  backUrl: any,
  leftUrl: any,
  rightUrl: any,
  registrationUrl: any,
  inspectionUrl: any,
  insuranceUrl: any,
  road: string
}
