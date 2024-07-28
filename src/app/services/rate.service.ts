import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  private apiUrl = `https://localhost:7041/api/Rate`;

  constructor(private http: HttpClient) { }

  getAllRates(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  createRate(rate: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, rate);
  }

  updateRate(id: number, rate: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, rate);
  }
}
