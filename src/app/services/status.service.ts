import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class StatusService {


  constructor(private http: HttpClient) {}

  
   private apiUrl = `${environment.apiUrl}/Status`; // use deployed API

  // Fetch all statuses
  getStatuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllStatuses`);
  }

  // Fetch status by ID
  getStatusById(statusId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetStatus/${statusId}`);
  }
}
