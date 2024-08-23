import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostCheckService {
  private apiUrl = 'https://localhost:7041/api/PostCheck'; 

  constructor(private http: HttpClient) { }

  // Create Post Check
  createPostCheck(postCheckData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreatePostCheck`, postCheckData);
  }

  // Get all Post Checks
  getAllPostChecks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllPostChecks`);
  }

  // Get Post Check by ID
  getPostCheck(postCheckId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetPostCheck/${postCheckId}`);
  }
}
