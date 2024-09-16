import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FAQ } from '../models/FAQ';


@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = 'https://localhost:7041/api/FAQ'; 
  
  constructor(private http: HttpClient) { }

// Get all FAQs (returns array of FAQs)
getAllFaqs(): Observable<FAQ[]> {
  return this.http.get<FAQ[]>(`${this.apiUrl}/GetAllFAQs`);
}

// Get FAQ by ID (returns a single FAQ)
getFaqById(id: number): Observable<FAQ> {
  return this.http.get<FAQ>(`${this.apiUrl}/GetFAQ/${id}`);
}

// Add new FAQ (admin) (takes and returns an FAQ object)
addFaq(faq: FAQ): Observable<FAQ> {
  return this.http.post<FAQ>(`${this.apiUrl}/AddFAQ`, faq);
}

// Update FAQ (admin) (takes and returns an FAQ object)
updateFaq(id: number, faq: FAQ): Observable<FAQ> {
  return this.http.put<FAQ>(`${this.apiUrl}/UpdateFAQ/${id}`, faq);
}

// Delete FAQ (admin) (no response body expected, so use `any` type)
deleteFaq(id: number): Observable<FAQ> {
  return this.http.delete<FAQ>(`${this.apiUrl}/DeleteFAQ/${id}`);
}

// Get FAQs posted to website (returns array of FAQs)
getWebsiteFaqs(): Observable<FAQ[]> {
  return this.http.get<FAQ[]>(`${this.apiUrl}/GetWebsiteFAQs`);
}
}
