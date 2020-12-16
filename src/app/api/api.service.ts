import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import SbibImage from '../models/SbibImage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:9494';
  
  constructor(private http: HttpClient) { }

  public getAllImages(): Observable<SbibImage[]> {
    return this.http.get<SbibImage[]>(this.baseUrl + '/images/all/2');
  }
}