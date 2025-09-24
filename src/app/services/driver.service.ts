import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DriverModel } from '../models/driver.model'; 
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private baseUrl = `${environment.apiUrl}/Driver`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllDrivers`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getDriver(userName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/SearchDriver/${userName}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  
  registerDriver(driver: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/RegisterDriver`, driver, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateDriver(userName: string, driver: DriverModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateDriver/${userName}`, driver, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  
  deleteDriver(userName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteDriver/${userName}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('DriverService error:', error);
    return throwError(error.error || 'Server error');
  }
}
