import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs';
import { Observable, map, of } from 'rxjs';
import { Service } from '../models/service.model';
import { Vehicle } from '../models/vehicle.model';
import { User } from '../models/user';
import { VehicleMake } from '../models/vehicle-make.model';
import { VehicleModel } from '../models/vehicle-model.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  apiUrl = 'https://localhost:7041/api/Service'
  VapiUrl = 'https://localhost:7041/api/Vehicle/GetAllVehicles'
  
httpOptions ={
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
}
  constructor(private http: HttpClient) {}

  
  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/GetServices`);
  }

  getServiceById(serviceId: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/GetService/${serviceId}`);
  }

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/CreateService`, service);
  }

  updateService(serviceId: number, service: Service): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UpdateService/${serviceId}`, service);
  }


  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.VapiUrl}`)
      .pipe(
        catchError((error: any) => {
          console.error('API error occurred:', error);
          throw error;
        })
      );
  }
  


}
