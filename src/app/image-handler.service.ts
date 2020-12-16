import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import SbibImage from './models/SbibImage';

@Injectable({
  providedIn: 'root'
})
export class ImageHandlerService {
  private image: BehaviorSubject<any> = new BehaviorSubject({});
  public currentImage: Observable<SbibImage> = this.image.asObservable();

  private dataSubject: BehaviorSubject<[]> = new BehaviorSubject([]);
  public data: Observable<any> = this.dataSubject.asObservable();

  constructor() { }

  public newSelectedImage(selectedImage: any) {
    console.log('get footprint');
    
    this.image.next(selectedImage);
  };
}
