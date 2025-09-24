import { HttpClient } from '@angular/common/http';
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

  getPreChecklist(id: number): Observable<PreCheckList> {
    return this.http.get<PreCheckList>(`${this.apiUrl}/${id}`);
  }

 
  createPreChecklist(preChecklist: any): Observable<any> {
    return this.http.post(this.apiUrl, preChecklist);
  }
}