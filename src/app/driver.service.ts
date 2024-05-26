import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriverModel } from './driver.model'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:5279/api/User'; 
  private driverUpdatedSubject: Subject<DriverModel> = new Subject<DriverModel>();

  constructor(private http: HttpClient) {}

  getAllDrivers(): Observable<DriverModel[]> {
    return this.http.get<DriverModel[]>(`${this.apiUrl}/GetAllDrivers`)
      .pipe(catchError(this.handleError<DriverModel[]>('getAllDrivers', [])));
  }

  searchDriver(username: string): Observable<DriverModel | null> {
    return this.http.get<DriverModel | null>(`${this.apiUrl}/SearchDriver/${username}`)
      .pipe(catchError(this.handleError<DriverModel | null>('searchDriver', null)));
  }
  
  

  registerDriver(driver: DriverModel): Observable<DriverModel> {
    return this.http.post<DriverModel>(`${this.apiUrl}/RegisterDriver`, driver)
      .pipe(
        tap((newDriver: DriverModel) => console.log('Registered new driver:', newDriver)),
        catchError(this.handleError<DriverModel>('registerDriver'))
      );
  }

  getDriverByUsername(username: string): Observable<DriverModel> {
    return this.http.get<DriverModel>(`${this.apiUrl}/GetDriverByUsername/${username}`)
      .pipe(catchError(this.handleError<DriverModel>('getDriverByUsername')));
  }

  updateDriver(username: string, driver: DriverModel): Observable<DriverModel> {
    return this.http.put<DriverModel>(`${this.apiUrl}/UpdateDriver/${username}`, driver)
      .pipe(
        tap((updatedDriver: DriverModel) => {
          this.driverUpdatedSubject.next(updatedDriver);
        }),
        catchError(this.handleError<DriverModel>('updateDriver'))
      );
  } 

  removeDriver(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/RemoveDriver/${username}`)
      .pipe(catchError(this.handleError<void>('removeDriver')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    console.error(`${operation} failed`);
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getDriverUpdatedSubject(): Observable<DriverModel> {
    return this.driverUpdatedSubject.asObservable();
  }
}
