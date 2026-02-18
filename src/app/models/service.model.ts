import { Vehicle } from "./vehicle.model";

export interface Service {
  serviceID?: number;
  vehicleID: number;
  adminName: string;
  adminEmail: string;
  description: string;
  startDate: Date;
  endDate: Date;
}