import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageHandlerService {
  private image: BehaviorSubject<object> = new BehaviorSubject({name: null});
  public currentImage: Observable<any> = this.image.asObservable();

  constructor() { }

  newSelectedImage(selectedImage: any) {
    this.image.next(selectedImage);
  };
}
