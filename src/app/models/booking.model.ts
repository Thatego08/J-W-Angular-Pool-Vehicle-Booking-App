export interface BookingModel {
  bookingID: number;
  userName: string;
  event?: string;
  startDate: Date;
  endDate: Date;
  vehicleName: string;
  projectNumber?: number;
  reminderSent: boolean;
  
  statusId: number;

}

export interface CreateBookingModel {
  userName: string;
  event?: string;
  startDate: Date;
  //endDate: Date;
  vehicleName: string;
  projectNumber?: number;
  reminderSent: boolean;
  type: string;
  //statusId: number;

}

// // models/vehicle.model.ts
// export interface Vehicle {
//   vehicleID: number;
//   name: string;
// }
