import { VehicleMake } from "./vehicle-make.model";

export interface VehicleModel {
    vehicleModelId: number;
    vehicleModelName: string;
    vehicleMakeID: number;
    vehicleMakeName?: string; 
    vehicleMake?: VehicleMake;
}