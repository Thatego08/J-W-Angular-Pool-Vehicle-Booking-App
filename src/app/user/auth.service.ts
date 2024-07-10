import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Feedback } from '../models/feedback.model';


// Define the interface for the response from the login API

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = 'https://localhost:7041/api/User';
  private FapiUrl = 'https://localhost:7041/api/Feedback';
  constructor(private http: HttpClient) {}

  login(credentials: { userName: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
        console.log('Storing token:', response.token);
          localStorage.setItem('token', response.token);  // Store the token in localStorage
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  register(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }


  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllUsers`);
  }

  editAdminUser(userName: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Edit-Admin-User/${userName}`, user);
  }

  editDriverUser(userName: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Edit-Driver-User/${userName}`, user);
  }

  getProfile(): Observable<any> 
  {const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
      catchError(error => {
        console.error('Profile fetch error:', error);
        return throwError(error);
      })
    );
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;  // Check if the token exists
  }
  private handleError(error: any): Observable<never> {
    // Handle error accordingly
    console.error('An error occurred:', error);
    return throwError(error);
  }


  //Feedback uses FapiUrl

  submitFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(`${this.FapiUrl}/submit`, feedback);
  }

  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.FapiUrl}/all`);
  }
}
