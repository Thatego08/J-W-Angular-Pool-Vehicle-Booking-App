import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'https://localhost:7041/api/Dashboard'; // Matches backend route
//private baseUrl = 'https://localhost:7041/api/Booking'
  constructor(private http: HttpClient) {}

   // Get dashboard summary metrics
  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  // Get recent bookings
  getRecentBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-bookings`);
  }

  // Get recently added vehicles
  getRecentlyAddedVehicles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-vehicles`);
  }

  // Get active issues
  getActiveIssues(): Observable<any> {
    return this.http.get(`${this.apiUrl}/active-issues`);
  }

  // Get overdue bookings
  getOverdueBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/overdue-bookings`);
  }

  // Get booking statistics for charts
  getBookingStatistics(days: number = 30): Observable<any> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get(`${this.apiUrl}/booking-statistics`, { params });
  }

  // Get vehicle status distribution
  getVehicleStatusDistribution(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicle-status-distribution`);
  }

  // Get dashboard metrics (alternative to summary)
  getDashboardMetrics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/metrics`);
  }
}