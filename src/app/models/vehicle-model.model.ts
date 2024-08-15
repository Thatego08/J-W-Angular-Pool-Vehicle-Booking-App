import { VehicleMake } from "./vehicle-make.model";

export interface VehicleModel {
    vehicleModelID: number;
    vehicleModelName: string;
    vehicleMakeID: number;
    vehicleMakeName?: string; 
    vehicleMake?: VehicleMake;
}