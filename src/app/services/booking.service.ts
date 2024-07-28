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
    return this.http.get<BookingModel[]>(`${this.baseUrl}/GetAllBookings`);
  }

  getBooking(id: number): Observable<BookingModel> {
    return this.http.get<BookingModel>(`${this.baseUrl}/${id}`);
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
    const url = `${this.baseUrl}/EditBooking/${booking.bookingID}`;
    return this.http.put<void>(url, booking);
  }

  deleteBooking(id: number): Observable<void> {
    const url = `${this.baseUrl}/DeleteBooking/${id}`;
    return this.http.delete<void>(url);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('https://localhost:7041/api/Vehicle/GetAllVehicles');
  }
}
