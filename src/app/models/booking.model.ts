export interface BookingModel {
  bookingID: number;
  userName: string;
  event?: string;
  startDate: Date;
  endDate: Date;
  vehicleName: string;
  projectNumber?: number;
  reminderSent: boolean;
  vehicleRegistration: string;
  statusId: number;

}

export interface CreateBookingModel {
  userName: string;
  event?: string;
  startDate: String;
  endDate: String;
  vehicleName: string;
  projectNumber?: number;
  reminderSent: boolean;
  type: string;
  vehicleRegistration: string;
  //statusId: number;

}

// // models/vehicle.model.ts
// export interface Vehicle {
//   vehicleID: number;
//   name: string;
// }
