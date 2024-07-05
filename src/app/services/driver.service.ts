import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriverModel } from '../models/driver.model'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private baseUrl = 'https://localhost:7041/api/Driver';


  constructor(private http: HttpClient) { }

  getAllDrivers(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/GetAllDrivers`, { headers });
  }
  getDriver(userName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/SearchDriver/${userName}`);
  }
  
  registerDriver(driver: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/RegisterDriver`, driver);
  }

  updateDriver(userName: string, updatedDriver: DriverModel): Observable<DriverModel> {
    const url = `${this.baseUrl}driver/Edit-Driver-User/${userName}`;
    return this.http.put<DriverModel>(url, updatedDriver, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }
  deleteDriver(userName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteDriver/${userName}`);
  }

    
    private handleError(error: any): Observable<never> {
      console.error(error);
      return throwError(error.error || 'Server error');
    }
  }
