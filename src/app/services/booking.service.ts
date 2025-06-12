import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { BookingModel, CreateBookingModel } from '../models/booking.model';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'https://localhost:7041/api/Booking';

  constructor(private http: HttpClient) { }

  getBookings(): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(`${this.baseUrl}/GetAllBookings`);
  }

  getBooking(id: number): Observable<BookingModel> {
    return this.http.get<BookingModel>(`${this.baseUrl}/GetBooking/${id}`);
}

// getAvailableVehicles(startDate: Date, endDate: Date): Observable<Vehicle[]> {
//   const url = `${this.baseUrl}/GetAvailableVehicles?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
//   return this.http.get<Vehicle[]>(url).pipe(
//     catchError(this.handleError)
//   );
// }

// booking.service.ts
// getAvailableVehicles(startDate: Date, endDate: Date, vehicleType?: string): Observable<Vehicle[]> {
//   let params = new HttpParams()
//     .set('startDate', startDate.toISOString())
//     .set('endDate', endDate.toISOString());



//   return this.http.get<Vehicle[]>(`${this.baseUrl}/GetAvailableVehicles`, { params }).pipe(
//     catchError(this.handleError)
//   );
// }

getAvailableVehicles(startDate: Date, endDate: Date, cabinType?: string): Observable<Vehicle[]> {
  let params = new HttpParams()
    .set('startDate', startDate.toISOString())
    .set('endDate', endDate.toISOString());

  if (cabinType) {
    params = params.set('cabinType', cabinType);
  }

  return this.http.get<Vehicle[]>(`${this.baseUrl}/GetAvailableVehicles`, { params }).pipe(
    tap((response: Vehicle[]) => console.log('API Vehicles Response:', response)), // Add logging
    catchError(error => {
      console.error('API Error:', error);
      return throwError(() => new Error('Failed to fetch vehicles'));
    })
  );
}



  searchBookingHistory(username: string): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(`${this.baseUrl}/SearchBookingHistory/${username}`);
  }


  createBooking(booking: CreateBookingModel): Observable<BookingModel> {
    return this.http.post<BookingModel>(`${this.baseUrl}/AddBooking`, booking, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateBooking(booking: BookingModel): Observable<void> {
    const url = `${this.baseUrl}/EditBooking?id=${booking.bookingID}`;
    return this.http.put<void>(url, booking);
  }

  deleteBooking(id: number): Observable<void> {
    const url = `${this.baseUrl}/DeleteBooking${id}`;
    return this.http.delete<void>(url);
  }
  cancelBooking(id: number): Observable<string> {
    const url = `${this.baseUrl}/CancelBooking/${id}`;
    return this.http.put<string>(url, {});
  }

  updateVehicleStatus(vehicleName: string, statusId: number): Observable<any> {
    const url = `${this.baseUrl}/UpdateVehicleStatus/${vehicleName}`; // Adjust the URL based on your API endpoint
    return this.http.put(url, { statusId }).pipe(
      catchError(this.handleError)
    );
  }

//   updateVehicleStatus(vehicleName: string, statusId: number): Observable<any> {
//     const payload = { statusId: statusId };
//     return this.http.put(`http://localhost:7041/api/Booking/UpdateVehicleStatus/${vehicleName}`, payload);
// }

  

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('https://localhost:7041/api/Vehicle/GetAllVehicles');
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    // Handle different error scenarios here, you can customize the error messages as needed
    let errorMessage = 'Something went wrong!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }


  sendConfirmationEmail(bookingID: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/SendConfirmationEmail/${bookingID}`, {});
  }
}
