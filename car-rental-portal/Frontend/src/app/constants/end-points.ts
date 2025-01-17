export var endpoints = {
  //admins api's

  admin_save: 'administrator/save',
  admin_login: 'administrator/login',

  //user (sellers and buyers) api's
  user_save: '/auth/register',
  activate: "/auth/activate",
  users_login: "/auth/authenticate",
  remember_user: "/auth/remember",
  forgotPwd: "/test",
  get_user: "/user",
  logout: "/auth/logout",
  refreshToken: "/auth/refresh-token",
  get_user_basic: "/user/car-owner-profile/",
  get_user_rating: '/rating/get-renter/by/user/',
  get_owner_rating: '/rating/get-owner/by/user/',
  get_car_owner: "/car-location/get/owner-car/",

  users_verify: "/users/verify",
  users_list_post: '/users/list_post',

  get_wallet_user: '/wallet/my-wallet',
  get_transaction_user: '/wallet/my-transaction',

  get_booking_list: '/booking/user-bookings',
  cancel_booking: '/booking/cancel/',

  payment_deposit: '/booking/pay-deposit/init/',
  payment_payment: '/booking/pay-payment/init/',
  confirm_pay_deposit: '/booking/pay-deposit/',
  confirm_pay_payment: '/booking/pay-payment/',
  get_booking_info: '/booking/user-booking/',

  get_my_profile:'/user',
  edit_profile: '/user/profile',

  //search
  search: '/car-location/search',
  all_car: '/car-location/get/all',

  //brand-model
  brand: '/brand/brand-name/all',
  brand_model: '/brand/brand-model/',

  //location
  all_city: '/location/cities/all',
  district_by_city: '/location/districts',
  ward_by_district: '/location/wards',

  //car detail
  get_car: '/car-basic/get/',
  get_relate_cars: '/car-location/get/related-car/',
  get_car_rating: '/rating/get-renter/by/car/',
  check_busy_time: '/car-busy/check/time-rent/',
  get_response_detail: '/car-basic/get/detail-response/',

  //rating
  save_rate: '/rating/save',
  get_booking_rate: '/rating/get/all/by/',
  get_star_received_co_by_time: '/rating/get/number-star-received/co/by/time',
  get_star_received_renter_by_time: '/rating/get/number-star-received/renter/by/time',
  get_rating_as_car_owner_by_time: '/rating/get/rating-received/car-owner/by/time',
  get_rating_as_renter_by_time: '/rating/get/rating-received/renter/by/time',
  get_avg_rate_received_co_fivemonths: '/rating/get/avg-rate/received/co/five-months',
  get_avg_rate_received_renter_fivemonths: '/rating/get/avg-rate/received/renter/five-months',


  //my-car
  get_car_detail_owner: '/car-basic/get-owner/by/owner',
  get_number_pending_request: '/booking/get/number/pending-booking',
  get_number_inprogress_request: '/booking/get/number/inprogress-booking',


  //history booking
  get_user_booking: '/booking/get/all/booking',

  //booking
  confirm_pick_up: '/booking/confirm-pick-up/',
  confirm_booking: '/booking/owner-confirm/',
  confirm_return: '/booking/return-car/',
  get_overlap_booking: '/booking/get/all/bookings-overlap-time/',
  get_overlap_booking_pending: '/booking/get/booking-overlap-time/pending',

  //image
  upload: '/image/upload/test',

  //feature
  get_feature_by_type: '/feature/get/by/feature-type',
  get_feature_by_name: '/feature/get/by/feature-name',

  //add-car
  add_car: '/car-basic/add',

  //admin
  get_all_approval_cars: '/admin/get-approval-car',
  approve_car: '/admin/approve-car/',
  decline_car: '/admin/decline-car/',

  //enable car
  enable_car: '/car-basic/enable/',

  //disable
  disable_car: '/car-basic/disable/',

  //create payment
  create_payment: '/wallet/my-wallet/create-payment/',

  //top up
  top_up: '/wallet/my-wallet/top-up-vnpay/',

  //confirm top up
  confirm_top_up: '/admin/user-wallet/confirm-top-up/',

  //confirm  withdraw
  confirm_withdraw: '/admin/user-wallet/confirm-withdraw/',

  //list approval transactions
  list_approval_transaction: '/admin/get-approval-transaction',

}
