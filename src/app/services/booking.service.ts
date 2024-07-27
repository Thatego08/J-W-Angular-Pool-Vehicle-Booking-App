import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingModel, CreateBookingModel, Vehicle } from '../models/booking.model';


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'https://localhost:7041/api/Booking';

  constructor(private http: HttpClient) { }

  getBookings(): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(this.baseUrl);
  }

  getBooking(id: number): Observable<BookingModel> {
    return this.http.get<BookingModel>(`${this.baseUrl}/${id}`);
  }

  searchBookingHistory(username: string): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(`${this.baseUrl}/history/${username}`);
  }

  createBooking(booking: CreateBookingModel): Observable<BookingModel> {

    console.log('Create booking service called with data:', booking); // Add this line

    return this.http.post<BookingModel>(this.baseUrl, booking, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateBooking(booking: BookingModel): Observable<void> {
    const url = `${this.baseUrl}/${booking.bookingID}`;
    return this.http.put<void>(url, booking);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('https://localhost:7041/api/Vehicle/GetAllVehicles');
  }
}
