import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TripModel } from '../trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'https://localhost:7041/api/Trip'; // Ensure this matches your backend URL

  constructor(private http: HttpClient) {}


  getAllTrips(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/GetAllTrips`, { headers });
  }

  getTripById(tripId: number): Observable<TripModel> {
    const url = `${this.apiUrl}/GetTripById/${tripId}`;
    return this.http.get<TripModel>(url).pipe(
      catchError(this.handleError)
    );
  }
  

  createTrip(trip: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post<any>(`${this.apiUrl}/createTrip`, trip, { headers });
  }




  updateTrip(tripId: number, updatedTrip: TripModel): Observable<TripModel> {
    const url = `${this.apiUrl}/${tripId}`;
    return this.http.put<TripModel>(url, updatedTrip, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }
  deleteTrip(TripId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteTrip/${TripId}`);
  }

  getPreviousTripsByUserName(userName: string): Observable<TripModel[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<TripModel[]>(`${this.apiUrl}/GetPreviousTripsByUserName/${userName}`, { headers });
  }

  createRefuelVehicle(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refuel-vehicle`, data);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}