import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PostCheckService {
  private apiUrl = `${environment.apiUrl}/PostCheck`;


  constructor(private http: HttpClient) { }

  // Create Post Check
  createPostCheck(postCheckData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreatePostCheck`, postCheckData);
  }

  deletePostCheck(postCheckId: number): Observable<void> {
    console.log('API call to delete post check with ID:', postCheckId); // Debug log
    return this.http.delete<void>(`${this.apiUrl}/${postCheckId}`);
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
