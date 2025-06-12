
import { Colour } from "./colour.model";
import { VehicleFuelType } from "./fuel.model";
import { InsuranceCover } from "./insurance.model";
import { LicenseDisk } from "./licensedisc.model";
import { Status } from "./status.model";
import { VehicleMake } from "./vehicle-make.model";
import { VehicleModel } from "./vehicle-model.model";

export interface Vehicle {
  vehicleID: number;
  name: string;
  description: string;
  dateAcquired: Date;
  licenseExpiryDate: Date;
  registrationNumber: string;
  insuranceCoverID: number;

  // Additions  
  cabinType:string;
  driveType:string;
  transmission:string;
  hasTowBar:boolean;
  hasCanopy:boolean;
  compliance: string;
  protection:string;
  vehicleType: string; // e.g., 'Car', 'Truck', 'Motorcycle'

  licenseDisk?: LicenseDisk;
  vin: string;
  engineNo: string;
  colourID: number;
  fuelTypeID: number;
  statusID: number;
  vehicleMakeID: number;
  vehicleModelID: number;
  insuranceCover?: InsuranceCover;
  colour?: Colour;
  fuelType?: VehicleFuelType;
  vehicleMake?: VehicleMake;
  vehicleModel?: VehicleModel;
  status?: Status;

}

export interface GroupedVehicles {
  status: string;
  vehicles: Vehicle[];
}