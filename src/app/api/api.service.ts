import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Image from '../models/Image';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:9494';
  
  constructor(private http: HttpClient) { }

  public getAllImages(): Observable<Image[]> {
    return this.http.get<Image[]>(this.baseUrl + '/images/all/2');
  }
}