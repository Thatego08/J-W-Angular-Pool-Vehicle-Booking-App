import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PreCheckList } from './pre-check-list';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreChecklistService {
  private apiUrl = `${environment.apiUrl}/prechecklist`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPreChecklist(id: number): Observable<PreCheckList> {
    const headers = this.getAuthHeaders();
    return this.http.get<PreCheckList>(`${this.apiUrl}/${id}`, { headers });
  }

  createPreChecklist(preChecklist: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, preChecklist, { headers });
  }
}
