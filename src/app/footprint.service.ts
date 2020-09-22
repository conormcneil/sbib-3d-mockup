import { Injectable } from '@angular/core';
import { Coordinate } from 'coordinate-systems';

@Injectable({
  providedIn: 'root'
})
export class FootprintService {
  private footprintString: String;
  private footprintList: Array<any>;
  public footprint: Array<any>;

  constructor(private imageName: String) {
    this.getFootprint();
  }

  public getFootprint(): void {
    console.log(this.imageName);
    console.log('faking API call to backend to retrieve footprint string... done.');
    
    this.footprintString = '214.7 -3.6, 200.4 -17.7, 200.1 -58.9, 120.4 -88.7, 89.8 -70.7, 81.9 -45.4, 83.3 -14.4, 72.2 6.9, 18.3 -9.8, 16.1 6.5, 2.6 22.1, 0.0 23.3, 0.0 46.7, 0.0 70.2, 0.0 90.0, 360.0 90.0, 360.0 70.2, 360.0 46.7, 360.0 23.3, 341.2 31.9, 322.5 29.8, 304.8 15.3, 297.4 -1.1, 222.4 21.9, 215.4 5.4, 214.7 -3.6';

    this.stringToList();
    this.toPolar();
  }

  public stringToList(): void {
    this.footprintList = this.footprintString.split(',').map(coordinate => {
      let pair = coordinate.trim().split(' ');
      let x = parseInt(pair[0]);
      let y = parseInt(pair[1]);
      
      return Coordinate.cartesian([x,y]);
    });
  }

  public toPolar(): void {
    this.footprint = this.footprintList.map((coordinate: Coordinate) => {
      return coordinate.polar();
    });
  }
}
