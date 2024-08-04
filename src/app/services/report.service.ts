import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError,map } from 'rxjs';

export interface VehicleReport {
  status: string;
  count: number;
}

export interface BookingTypeReport {
  type: string;
  count: number;
}

export interface TripReport {
  totalTrips: number;
  tripsWithAccidents: number;
}

export interface BookingStatusReport {
  status: string;
  count: number;
}

export interface ProjectReport {
  status: string;
  count: number;
}


@Injectable({
  providedIn: 'root'
})
export class ReportService {


  private baseUrl = 'https://localhost:7041/api/reports';

  constructor(private http: HttpClient) {}

  getVehicleReport(): Observable<VehicleReport[]> {
    return this.http.get<VehicleReport[]>(`${this.baseUrl}/vehicles`)
      .pipe(
        map((response: any) => response || []),
        catchError(this.handleError)
      );
  }

  // getBookingTypeReport(): Observable<BookingTypeReport[]> {
  //   return this.http.get<BookingTypeReport[]>(`${this.baseUrl}/booking-types`).pipe(
  //     map((response: any) => response || []),
  //     catchError(this.handleError)
  //   )
  //   ;
  // }

  // getTripReport(): Observable<TripReport> {
  //   return this.http.get<TripReport>(`${this.baseUrl}/trips`).pipe(
  //     map((response: any) => response || []),
  //     catchError(this.handleError)
  //   );
  // }

  // getBookingStatusReport(): Observable<BookingStatusReport[]> {
  //   return this.http.get<BookingStatusReport[]>(`${this.baseUrl}/booking-status`).pipe(
  //     map((response: any) => response || []),
  //     catchError(this.handleError)
  //   );
  // }

  getProjectReport(): Observable<ProjectReport[]> {
    return this.http.get<ProjectReport[]>(`${this.baseUrl}/projects`).pipe(
      map((response: any) => response || []),
      catchError(this.handleError)
    );
  }


  //New Additions


  getVehicleStatusReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/VehicleStatusReport`);
  }

  getBookingTypeReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/BookingTypeReport`);
  }

  getTripReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/TripReport`);
  }

  getBookingStatusReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/BookingStatusReport`);
  }

  getProjectStatusReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ProjectStatusReport`);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }
}
