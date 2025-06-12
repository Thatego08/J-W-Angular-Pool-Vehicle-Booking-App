import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs';
import { Colour } from '../models/colour.model';
import { InsuranceCover } from '../models/insurance.model';
import { LicenseDisk } from '../models/licensedisc.model';
import { Status } from '../models/status.model';
import { Vehicle } from '../models/vehicle.model';
import { VehicleChecklist } from '../models/checklist.model';
import { VehicleFuelType } from '../models/fuel.model';
import { VehicleMake } from '../models/vehicle-make.model';
import { VehicleModel } from '../models/vehicle-model.model';
import { Protection } from 'exceljs';
import { CabinType } from '../models/cabin-type.model';
import { Compliance } from '../models/compliance.model';
import { DriveType } from '../models/drive-type.model';
import { Transmission } from '../models/transmission.model';
import { VehicleType } from '../models/vehicle-type.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'https://localhost:7041/api/Vehicle'
  selectedVehicleType!: string;
  selectedDriveType!: string;
  selectedTransmission!: string;
  hasTowBar: any;
  hasCanopy: any;
  constructor(private http: HttpClient) { }

  //Vehicles
  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/GetAllVehicles`)
      .pipe(
        catchError((error: any) => {
          console.error('API error occurred:', error);
          throw error;
        })
      );
  }

  // Combined filter method
applyAllFilters(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.filter(vehicle => {
    // Cabin Type filter - use cabinType property
    const typeMatch = this.selectedVehicleType === 'All' || 
      (this.selectedVehicleType === 'Double Cab' && vehicle.cabinType === 'Double') ||
      (this.selectedVehicleType === 'Single Cab' && vehicle.cabinType === 'Single') ||
      (this.selectedVehicleType === 'Extra Cab' && vehicle.cabinType === 'Extra');

    // Drive Type filter - use driveType property
    const driveMatch = this.selectedDriveType === 'All' || 
      vehicle.driveType === this.selectedDriveType;

    // Transmission filter - use transmission property
    const transmissionMatch = this.selectedTransmission === 'All' ||
      vehicle.transmission === this.selectedTransmission;

    // Features filter - use boolean properties
    const towBarMatch = !this.hasTowBar || vehicle.hasTowBar;
    const canopyMatch = !this.hasCanopy || vehicle.hasCanopy;

    return typeMatch && driveMatch && transmissionMatch && towBarMatch && canopyMatch;
  });
}

  // getAvailableVehicles(): Observable<Vehicle[]> {
  //   return this.http.get<Vehicle[]>(`${this.apiUrl}/GetAvailableVehicles`)
  //     .pipe(
  //       catchError((error: any) => {
  //         console.error('API error occurred:', error);
  //         throw error;
  //       })
  //     );
  // }

 getAvailableVehicles(startDate: Date, endDate: Date): Observable<Vehicle[]> {
    // Create HTTP params
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<Vehicle[]>(`${this.apiUrl}/GetAvailableVehicles`, { params })
      .pipe(
        tap(response => {
          // Debugging: Log API response
          console.log('API Response - Available Vehicles:', response);
          
          // Log each vehicle's details
          if (response && response.length > 0) {
            console.log('Vehicle Details:');
            response.forEach(vehicle => {
              console.log(
                `ID: ${vehicle.vehicleID} | Name: ${vehicle.name} | ` +
                `Cabin: ${vehicle.cabinType} | Drive: ${vehicle.driveType} | ` +
                `Transmission: ${vehicle.transmission} | ` +
                `Tow: ${vehicle.hasTowBar} | Canopy: ${vehicle.hasCanopy}`
              );
            });
          } else {
            console.warn('API returned empty vehicle list');
          }
        }),
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }
  
  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  // Add these methods to your VehicleService
getAllTransmissions(): Observable<Transmission[]> {
  return this.http.get<Transmission[]>(`${this.apiUrl}/Transmissions`);
}

getAllDriveTypes(): Observable<DriveType[]> {
  return this.http.get<DriveType[]>(`${this.apiUrl}/DriveTypes`);
}

getAllCabinTypes(): Observable<CabinType[]> {
  return this.http.get<CabinType[]>(`${this.apiUrl}/CabinTypes`);
}

getAllCompliances(): Observable<Compliance[]> {
  return this.http.get<Compliance[]>(`${this.apiUrl}/Compliances`);
}

getAllProtections(): Observable<Protection[]> {
  return this.http.get<Protection[]>(`${this.apiUrl}/Protections`);
}

getAllVehicleTypes(): Observable<VehicleType[]> {
  return this.http.get<VehicleType[]>(`${this.apiUrl}/VehicleTypes`);
}
  getVehicleId(vehicleId: string): Observable<Vehicle>{
    return this.http.get<Vehicle>(`${this.apiUrl}/GetVehicle/` + vehicleId)
  }

  addVehicle(vehicle: Vehicle): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddVehicle`, vehicle);
  }

  updateVehicle(id: number, vehicle: Vehicle): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/EditVehicle/` + id, vehicle)
  }

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteVehicle/${vehicleId}`);
  }

  //Vehicle Checklist
  // Add these methods for each entity type
addTransmission(transmission: Transmission): Observable<Transmission> {
  return this.http.post<Transmission>(`${this.apiUrl}/Transmissions`, transmission);
}

getTransmission(id: number): Observable<Transmission> {
  return this.http.get<Transmission>(`${this.apiUrl}/Transmissions/${id}`);
}

updateTransmission(id: number, transmission: Transmission): Observable<any> {
  return this.http.put(`${this.apiUrl}/Transmissions/${id}`, transmission);
}

deleteTransmission(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/Transmissions/${id}`);
}
  

  
  //Colours

  private colourUrl = 'https://localhost:7041/api/Vehicle/GetAllColours'


  getAllColours(): Observable<Colour[]> {
    return this.http.get<Colour[]>(`${this.colourUrl}`)
      .pipe(
        catchError((error: any) => {
          console.error('API error occurred:', error);
          throw error;
        })
      );
  }

  getColourId(colourId: string): Observable<Colour>{
    return this.http.get<Colour>(`${this.apiUrl}/GetColour/` + colourId)
  }


  getColour(id: number): Observable<Colour> {
    return this.http.get<Colour>(`${this.apiUrl}/${id}`);
  }

  addColour(colour: Colour): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddColour`, colour);
  }

  updateColour(id: number, colour: Colour): Observable<Colour>{
    return this.http.put<Colour>(`${this.apiUrl}/EditColour/` + id, colour)
  }


  deleteColour(colourId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteColour/${colourId}`);
  }

  
  //Fuel Types
  getAllFuelTypes(): Observable<VehicleFuelType[]> {
    return this.http.get<VehicleFuelType[]>(`${this.apiUrl}/GetAllFuelTypes`);
  }

  getFuelId(fuelId: string): Observable<VehicleFuelType>{
    return this.http.get<VehicleFuelType>(`${this.apiUrl}/GetFuelType/` + fuelId)
  }

  addFuelType(fuelType: VehicleFuelType): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddFuelType`, fuelType);
  }

  editFuelType(fuelId: number, fuelType: VehicleFuelType): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditFuel/${fuelId}`, fuelType);
  }

  deleteFuelType(fuelId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteFuel/${fuelId}`);
  }

  getFuel(id: number): Observable<VehicleFuelType> {
    return this.http.get<VehicleFuelType>(`${this.apiUrl}/${id}`);
  }

  //LicenseDisk
  getAllDisks(): Observable<LicenseDisk[]> {
    return this.http.get<LicenseDisk[]>(`${this.apiUrl}/GetAllLicenseDisks`)
      .pipe(
        catchError((error: any) => {
          console.error('API error occurred:', error);
          throw error;
        })
      );
  }


  //Insurance
  getAllInsuranceCovers(): Observable<InsuranceCover[]> {
    return this.http.get<InsuranceCover[]>(`${this.apiUrl}/GetInsuranceCovers`);
  }

  addInsuranceCover(insurance: InsuranceCover): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddInsuranceCover`, insurance);
  }

  editInsuranceCover(insuranceId: number, insurance: InsuranceCover): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditInsurance/${insuranceId}`, insurance);
  }

  updateInsurance(formData: FormData, insuranceCoverId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditInsurance/${insuranceCoverId}`, formData);
  }

  deleteInsuranceCover(insuranceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteInsurance/${insuranceId}`);
  }

  getInsurance(id: number): Observable<InsuranceCover> {
    return this.http.get<InsuranceCover>(`${this.apiUrl}/${id}`);
  }

  getCoverId(coverId: string): Observable<InsuranceCover>{
    return this.http.get<InsuranceCover>(`${this.apiUrl}/GetInsurance/` + coverId)
  }

  updateCover(id: number, cover: InsuranceCover): Observable<InsuranceCover>{
    return this.http.put<InsuranceCover>(`${this.apiUrl}/EditInsurance/` + id, cover)
  }
  


  //Vehicle Make
  getAllVehicleMakes(): Observable<VehicleMake[]> {
    return this.http.get<VehicleMake[]>(`${this.apiUrl}/GetAllVehicleMakes`);
  }

  addVehicleMake(vehicleMake: VehicleMake): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddVehicleMake`, vehicleMake);
  }

  editVehicleMake(makeId: number, vehicleMake: VehicleMake): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditMake/${makeId}`, vehicleMake);
  }

  deleteVehicleMake(makeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteMake/${makeId}`);
  }

  getMake(id: number): Observable<VehicleMake> {
    return this.http.get<VehicleMake>(`${this.apiUrl}/${id}`);
  }

  getMakeId(makeId: string): Observable<VehicleMake>{
    return this.http.get<VehicleMake>(`${this.apiUrl}/GetVehicleMake/` + makeId)
  }

  updateMake(id: number, make: VehicleMake): Observable<VehicleMake>{
    return this.http.put<VehicleMake>(`${this.apiUrl}/EditMake/` + id, make)
  }
  


  //Vehicle Model
  getAllVehicleModels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllVehicleModels`);
  }

  addVehicleModel(vehicleModel: VehicleModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddVehicleModel`, vehicleModel);
  }

  editVehicleModel(modelId: number, vehicleModel: VehicleModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditModel/${modelId}`, vehicleModel);
  }

  deleteVehicleModel(modelId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteModel/${modelId}`);
  }

   // Fetch vehicle models by makeId
   getVehicleModelsByMake(makeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetModelByMake/${makeId}`);
  }

  getModel(id: number): Observable<VehicleModel> {
    return this.http.get<VehicleModel>(`${this.apiUrl}/${id}`);
  }

  getModelId(modelId: string): Observable<VehicleModel>{
    return this.http.get<VehicleModel>(`${this.apiUrl}/GetVehicleModel/` + modelId)
  }

  updateModel(id: number, model: VehicleModel): Observable<VehicleModel>{
    return this.http.put<VehicleModel>(`${this.apiUrl}/EditModel/` + id, model)
  }
  
  //Status
  getAllStatus(): Observable<Status[]> {
    return this.http.get<Status[]>(`${this.apiUrl}/GetAllStatus`);
  }


  private handleError(error: HttpErrorResponse) {
    console.error('Service error:', error);
    return throwError('Something went wrong; please try again later.');
  }

}
