import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { Feedback } from '../models/feedback.model';
import { jwtDecode } from 'jwt-decode';
import { AuditLog } from '../models/auditlog';
import { environment } from '../environments/environment'


// Define the interface for the response from the login API

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private loggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string>('');
  
  private apiUrl = `${environment.apiUrl}/User`;
  private FapiUrl = `${environment.apiUrl}/Feedback`;
  private bapiUrl = `${environment.apiUrl}/Admin`;
currentUser: any;
  constructor(private http: HttpClient) 
  {

    this.userRole.next(this.getUserRole() ?? '');
    this.loggedIn.next(this.isAuthenticated());
  }

  login(credentials: { userName: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
        console.log('Storing token:', response.token);
          localStorage.setItem('token', response.token);  // Store the token in localStorage
          this.loggedIn.next(true);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );

//Login tracker
    this.loggedIn.next(true);
  }

  register(registerData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/register`, registerData).pipe(
    tap(response => {
      if (response.token) {
        console.log('Storing token after registration:', response.token);
        localStorage.setItem('token', response.token);
        this.loggedIn.next(true);
      }
    }),
    catchError(this.handleError)
  );
}


  // Update user profile
  updateUserProfile(userName: string, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-user?userName=${userName}`, profileData);
  }

  updateDetails(userName: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-details?userName=${userName}`, formData);
  }
  
  logout(): Observable<any> {

    this.loggedIn.next(false);
    return this.http.post(`${this.apiUrl}/logout`, {});
  }


  getAuditLogs(username: string = ''): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}?username=${username}`);
  }


  editAuditLogDetails(id: number, newDetails: string): Observable<void> {
    const body = { newDetails: newDetails };  // Wrap in an object
    return this.http.put<void>(`${this.apiUrl}/edit/${id}`, body);
  }
  

  deleteAuditLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, data); // Replace with your actual verify OTP endpoint
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
  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // getUserRole(): string {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const decodedToken: any = jwtDecode(token);
  //     console.log('Decoded token:', decodedToken);
  //     return decodedToken; // Adjust this based on the structure of your token
  //   }
  //   return '';
  // }
  get currentUserRole(): Observable<string> {
    return this.userRole.asObservable();
  }
  //Feedback uses FapiUrl

  submitFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(`${this.FapiUrl}/submit`, feedback);
  }

  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.FapiUrl}/all`);
  }

  getOtpExpiration(): Observable<any> {
    return this.http.get(`${this.bapiUrl}/otp-expiration`);
  }
  
  updateOtpExpiration(newExpirationTime: number): Observable<any> {
    return this.http.post(`${this.bapiUrl}/update-otp-expiration`, newExpirationTime);
  }
  


  //Authentication additions

  getDecodedToken(): any {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      // The role is stored in `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    return null;
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'Admin';
  }

  isDriver(): boolean {
    const role = this.getUserRole();
    return role === 'Driver';
  }
}
