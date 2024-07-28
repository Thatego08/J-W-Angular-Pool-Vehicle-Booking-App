import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://localhost:7041/api/admin'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  // Fetch all admins
  getAllAdmins(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/getAllAdmins`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch a specific admin by username
  getAdmin(userName: string): Observable<Admin> {
    return this.http.get<Admin>(`${this.baseUrl}/getAllAdmins/${userName}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update an admin's details
  updateAdmin(userName: string, updatedAdmin: Admin): Observable<Admin> {
    const url = `${this.baseUrl}/UpdateAdmin/${userName}`;
    return this.http.post<Admin>(url, updatedAdmin, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an admin by username
  deleteAdmin(userName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteAdmin/${userName}`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error(error);
    return throwError(error.error || 'Server error');
  }
}
