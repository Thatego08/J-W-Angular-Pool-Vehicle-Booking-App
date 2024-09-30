import { Vehicle } from "./vehicle.model";

export interface Service {
    serviceId?: number;
    vehicleID: number;
    adminName: string;
    adminEmail: string;
    description: string;
    serviceDate: Date;
    vehicle?: Vehicle;
}