import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { RefuelVehicle } from './refuel-vehicle';
import { environment } from './environments/environment';
 // Assuming you have a model defined for RefuelVehicle

@Injectable({
  providedIn: 'root'
})
export class RefuelVehicleService {

  
  private apiUrl = `${environment.apiUrl}/refuelvehicle`;  // Update with your actual API URL

  constructor(private http: HttpClient) { }

  // Method to post RefuelVehicle
  addRefuelVehicle(refuelVehicle: RefuelVehicle): Observable<RefuelVehicle> {
    return this.http.post<RefuelVehicle>(this.apiUrl, refuelVehicle).pipe(
      catchError(error => {
        console.error('Error adding refuel vehicle:', error);
        return throwError(() => new Error('Error adding refuel vehicle'));
      })
    );
  }

  
  getRefuelVehicles(): Observable<RefuelVehicle[]> {
    return this.http.get<RefuelVehicle[]>(this.apiUrl);
  }
}
