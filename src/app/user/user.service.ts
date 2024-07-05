import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7041/User';

  constructor(private http: HttpClient) { }

  // login(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, data);
  // }

  // register(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/register`, data);
  // }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/profile`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
  // logout(): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/logout`, {});
  // }

  addFeedback(feedback: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/feedback`, feedback);
  }

  getAuditLogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/audit-logs`);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
