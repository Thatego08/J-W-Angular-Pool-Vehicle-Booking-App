import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'https://localhost:7041/api/Dashboard'; // Matches backend route
//private baseUrl = 'https://localhost:7041/api/Booking'
  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  getRecentBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-bookings`);
  }

  getRecentlyAddedVehicles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-vehicles`);
  }

  getActiveIssues(): Observable<any> {
    return this.http.get(`${this.apiUrl}/active-issues`);
  }

  getOverdueBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/overdue-bookings`);
  }
}