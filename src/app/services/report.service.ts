import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError,map } from 'rxjs';

export interface VehicleReport {
  status: string;
  count: number;
}
export interface VehicleMakeReport {
  make: string;
  count: number;
}


export interface BookingTypeReport {
  type: string;
  count: number;
}

export interface TripReport {

  map(arg0: (trip: { date: any; }) => any): unknown;
  totalTrips: number;
  accidents?: number;
  tripType: string;
  count: number;
  date: string;
  travelStart?: Date;
}

export interface BookingStatusReport {
  status: string;
  count: number;
}

export interface UserTripReportDto {
  userName: string;
  month: string; // Month name
  year: number;
  tripCount: number;
}

export interface ProjectReport {
  status: string;
  count: number;
}
export interface FuelExpenditureReport {
  vehicle: string;
  numberOfTrips: number;
  fuelAmount: number;
  fuelCost: number;
}
export interface VehicleFuelReport {
  vehicleName: string;
  tripDate: Date;
  fuelAmount: number;
  fuelCost: number;
}

export interface BookingsPerUserReport {
  userName: string;
  month: string; // Month name
  year: number;
  bookingCount: number;
}

export interface CancelledBookingsReport {
  userName: string;
  bookingId: number;
  endDate: string;
}

export interface TripDurationReport {
  tripId: number;
  vehicleName: string;
  location: string;
  bookingStart: string;
  bookingEnd: string;
  travelStart: string;
  travelEnd: string;
  earliestStart: string;
  duration: string;
  openingKms: number;
  closingKms: number;
  travelledKms: number;
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

  getFuelExpenditureReportAsync(): Observable<FuelExpenditureReport[]> {
    return this.http.get<FuelExpenditureReport[]>(`${this.baseUrl}/fuel-expenditure`);
  }

  getVehicleMakeReport(): Observable<VehicleMakeReport[]> {
    return this.http.get<VehicleMakeReport[]>(`${this.baseUrl}/vehicle-make`);
  }

  getVehicleFuelReport(): Observable<VehicleFuelReport[]> {
    return this.http.get<VehicleFuelReport[]>(`${this.baseUrl}/vehicle-fuel-report`)
      .pipe(
        map((response: any) => response || []),
        catchError(this.handleError)
      );
  }

  getProjectReport(): Observable<ProjectReport[]> {
    return this.http.get<ProjectReport[]>(`${this.baseUrl}/projects`).pipe(
      map((response: any) => response || []),
      catchError(this.handleError)
    );
  }

  getTripsPerUserPerMonth(): Observable<UserTripReportDto[]> {
    return this.http.get<UserTripReportDto[]>(`${this.baseUrl}/trips-per-user-per-month`).pipe(
      map(response => response || []),
      catchError(this.handleError)
    );
  }

 getTripDurationReport() {
  return this.http.get<TripDurationReport[]>(`${this.baseUrl}/trip-duration-report`);
}


  //New Additions


  // getVehicleStatusReport(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/VehicleStatusReport`);
  // }

  // getBookingTypeReport(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/BookingTypeReport`);
  // }

  // getTripReport(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/TripReport`);
  // }

  // getBookingStatusReport(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/BookingStatusReport`);
  // }

  // getProjectStatusReport(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/ProjectStatusReport`);
  // }

  // private handleError(error: any): Observable<never> {
  //   console.error('An error occurred', error);
  //   return throwError('Something went wrong; please try again later.');
  // }

  //Patched list


  getVehicleStatusReport(): Observable<VehicleReport[]> {
    return this.http.get<VehicleReport[]>(`${this.baseUrl}/VehicleStatusReport`).pipe(
      map(response => response || []),
      catchError(this.handleError)
    );
  }

  getBookingTypeReport(): Observable<BookingTypeReport[]> {
    return this.http.get<BookingTypeReport[]>(`${this.baseUrl}/BookingTypeReport`).pipe(
      map(response => response || []),
      catchError(this.handleError)
    );
  }

  getTripReport(): Observable<TripReport[]> {
    return this.http.get<TripReport[]>(`${this.baseUrl}/TripReport`).pipe(
      map(response => response || []),
      catchError(this.handleError)
    );
  }

  getBookingStatusReport(): Observable<BookingStatusReport[]> {
    return this.http.get<BookingStatusReport[]>(`${this.baseUrl}/BookingStatusReport`).pipe(
      map(response => response || []),
      catchError(this.handleError)
    );
  }

  getProjectStatusReport(): Observable<ProjectReport[]> {
    return this.http.get<ProjectReport[]>(`${this.baseUrl}/ProjectStatusReport`).pipe(
      map(response => response || []),
      catchError(this.handleError)
    );
  }

  // Method to fetch bookings per user per month
  getBookingsPerUserPerMonth(): Observable<BookingsPerUserReport[]> {
    return this.http.get<BookingsPerUserReport[]>(`${this.baseUrl}/bookings-per-user-per-month`).pipe(
      map(response => response || []),
      catchError(this.handleError)
    );
  }

  // Method to fetch cancelled bookings per month
  getCancelledBookingsPerMonth(): Observable<CancelledBookingsReport[]> {
    return this.http.get<CancelledBookingsReport[]>(`${this.baseUrl}/cancelled-bookings-per-month`).pipe(
        map(response => response || []),
        catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }
}
