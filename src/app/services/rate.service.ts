import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rate } from '../models/rate';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RateService {

  private baseUrl = `${environment.apiUrl}/Rate`;

  constructor(private http: HttpClient) { }

  getAllRates(): Observable<Rate[]> {
    return this.http.get<Rate[]>(`${this.baseUrl}/get-rate`);
  }

  createRate(rate: Rate): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-rate`, rate);
  }

  updateRate(RateID: number, rate: Rate): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-rate/${RateID}`, rate);
  }
 
  

  deleteRate(RateID: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${RateID}`);
  }
}
