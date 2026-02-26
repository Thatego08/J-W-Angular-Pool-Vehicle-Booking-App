import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/Project';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = `${environment.apiUrl}/Project`;

  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getProjectNumbers(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/projectNumbers`);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/GetAllProjects`);
  }

  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/GetProject/${projectId}`);
  }

  addProject(project: Project): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddProject`, project, this.getHttpOptions());
  }

  updateProject(projectID: number, project: Project): Observable<any> {
    return this.http.put(`${this.baseUrl}/EditProject/${projectID}`, project, this.getHttpOptions());
  }

  deleteProject(projectID: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteProject/${projectID}`);
  }
}