const URL = "https://gatherly-dyco.onrender.com";

export const REGISTER = `${URL}/api/users/register`;
export const LOGIN = `${URL}/api/users/login`;
export const LOGOUT = `${URL}/api/user/logout`;
export const USER_INFO_UPDATE = `${URL}/api/users/updateUser`;
export const CHANGE_PASSWORD = `${URL}/api/users/changePassword`;
export const CREATE_EVENT = `${URL}/api/events/createEvent`;
export const UPDATE_EVENT = `${URL}/api/events/updateEvent`;
export const DELETE = `${URL}/api/events/deleteEvent/:id`;
// export const CREATE_BOOKING = `${URL}/api/booking/createBooking/:id`;
export const DELETE_BOOKING = `${URL}/api/booking/deleteBooking/:id`;
export const ALL_EVENT = `${URL}/api/events/allEvent`;
export const FIND_EVENT_BY_ID = `${URL}/api/events`;

//local
export const CREATE_BOOKING = `${URL}/api/booking/eventBooking`
export const VERIFY_PAYMENT = `${URL}/api/booking/verifyPayment`
