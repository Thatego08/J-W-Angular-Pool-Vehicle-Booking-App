import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreChecklistService {
  private apiUrl = 'https://localhost:7041/api/prechecklist';
  constructor(private http: HttpClient) {}

  createPreChecklist(preChecklist: any): Observable<any> {
    return this.http.post(this.apiUrl, preChecklist);
  }
}