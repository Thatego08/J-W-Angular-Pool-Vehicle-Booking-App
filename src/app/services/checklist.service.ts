import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VehicleChecklist } from '../models/checklist.model';
import { PostChecklist } from '../models/postchecklist.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private apiUrl = 'https://localhost:7041/api/Checklist';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private http: HttpClient) {}

  // Fetch all vehicle checklists
  getAllChecklists(): Observable<VehicleChecklist[]> {
    return this.http.get<VehicleChecklist[]>(`${this.apiUrl}/GetAllChecklists`);
  }

  // Add a new vehicle checklist
  addVehicleChecklist(checklist: VehicleChecklist): Observable<VehicleChecklist> {
    return this.http.post<VehicleChecklist>(`${this.apiUrl}/AddVehicleChecklist`, checklist);
  }

  // Fetch all post checklists
  getPostChecklists(): Observable<PostChecklist[]> {
    return this.http.get<PostChecklist[]>(`${this.apiUrl}/GetPostChecklists`);
  }

  // Add a new post checklist
  addPostChecklist(checklist: PostChecklist): Observable<PostChecklist> {
    return this.http.post<PostChecklist>(`${this.apiUrl}/AddPostChecklist`, checklist);
  }
}
