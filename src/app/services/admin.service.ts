import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Admin } from '../models/admin';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/Admin`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetch all admins
  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/getAllAdmins`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Register a new admin
  registerAdmin(admin: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/RegisterAdmin`, admin, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Fetch a specific admin by username
  getAdmin(userName: string): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/getAllAdmins/${userName}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Update an admin's details
  updateAdmin(userName: string, updatedAdmin: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/UpdateAdmin/${userName}`, updatedAdmin, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Delete an admin by username
  deleteAdmin(userName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteAdmin/${userName}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Update OTP timer
  updateOtpTimer(data: { expirationTimeInMinutes: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-otp-timer`, data, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error(error);
    return throwError(() => error.error || 'Server error');
  }
}
