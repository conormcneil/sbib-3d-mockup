import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Image from './models/Image';

@Injectable({
  providedIn: 'root'
})
export class ImageHandlerService {
  private image: BehaviorSubject<object> = new BehaviorSubject({name: null});
  public currentImage: Observable<any> = this.image.asObservable();

  private dataSubject: BehaviorSubject<object> = new BehaviorSubject([]);
  public data: Observable<any> = this.dataSubject.asObservable();

  constructor() { }

  public newSelectedImage(selectedImage: any) {
    this.image.next(selectedImage);
  };
}
