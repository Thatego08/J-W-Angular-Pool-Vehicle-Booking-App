import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {


  constructor(private http: HttpClient) {}

  
  apiUrl = 'https://localhost:7041/api/Status'

  // Fetch all statuses
  getStatuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllStatuses`);
  }

  // Fetch status by ID
  getStatusById(statusId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetStatus/${statusId}`);
  }
}
