import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RatesEE } from '../models/ratesEE';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RateEEserviceService {

   private baseUrl = `${environment.apiUrl}/RatesEE`; // adjust to your API base

  constructor(private http: HttpClient) {}

  getAllRates(): Observable<RatesEE[]> {
    return this.http.get<RatesEE[]>(this.baseUrl);
  }

  getRateById(id: number): Observable<RatesEE> {
    return this.http.get<RatesEE>(`${this.baseUrl}/${id}`);
  }

  getRatesByProject(projectId: number): Observable<RatesEE[]> {
    return this.http.get<RatesEE[]>(`${this.baseUrl}/ByProject/${projectId}`);
  }

  createRate(rate: RatesEE): Observable<RatesEE> {
    return this.http.post<RatesEE>(this.baseUrl, rate);
  }

  updateRate(id: number, rate: RatesEE): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, rate);
  }

  deleteRate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
