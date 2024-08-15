import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'https://localhost:7041/api/Project'; // API URL

  constructor(private http: HttpClient) { }

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
    return this.http.post(`${this.baseUrl}/AddProject`, project);
  }

  updateProject(projectID: number, project: Project): Observable<any> {
    return this.http.put(`${this.baseUrl}/EditProject/${projectID}`, project);
  }

  deleteProject(projectID: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteProject/${projectID}`);
  }
}
