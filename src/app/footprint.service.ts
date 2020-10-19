import { Injectable } from '@angular/core';
import { Coordinate } from 'coordinate-systems';

@Injectable({
  providedIn: 'root'
})
export class FootprintService {
  private string: String;
  public footprint: Array<any>;
  public cartesian2: Array<any>;
  public cartesian3: Array<any>;
  public polar: Array<any>;
  public spherical: Array<any>;

  constructor(private imageName: String) {
    this.imageName = imageName;
    this.getFootprint();
  }

  public getFootprint(): void {
    console.log(this.imageName);
    console.log('faking API call to backend to retrieve footprint string...');
    
    // TEST FOOTPRINT STRINGS
    // 67P
    // this.string = '214.7 -3.6, 200.4 -17.7, 200.1 -58.9, 120.4 -88.7, 89.8 -70.7, 81.9 -45.4, 83.3 -14.4, 72.2 6.9, 18.3 -9.8, 16.1 6.5, 2.6 22.1, 0.0 23.3, 0.0 46.7, 0.0 70.2, 0.0 90.0, 360.0 90.0, 360.0 70.2, 360.0 46.7, 360.0 23.3, 341.2 31.9, 322.5 29.8, 304.8 15.3, 297.4 -1.1, 222.4 21.9, 215.4 5.4, 214.7 -3.6';
    // Ceres
    this.string = ' 266.0456331267333212 76.9673113707799104, 271.5608355606398732 75.5740203603754566, 275.9619933538352825 74.0963854120188614, 277.8891451357622486 73.3406501426136828, 272.9243603328374661 72.2095127429755195, 268.5571394480034542 70.9608507418997903, 266.5621980036389118 70.3081046559344429, 262.2587956880706201 71.5208941354086534, 257.2398528732725254 72.6615019614475131, 254.4556459628287541 73.1968822166433171, 258.4637622856633925 74.7813608118122488, 263.2621859803560938 76.2653393430885700, 266.0456331267333212 76.9673113707799104';

    // once string is loaded,
    // convert to spherical coordinates and store output as `footprint` (default)
    this.convert();
  }

  public convert(): void {
    // input: footprint string

    // 1. convert string to list of 2d cartesian points
    this.toCartesian2();

    // 2. convert list of 2d cartesian points to spherical coordinates
    // convert to polar coordinates, then add extra dimension...
    this.toPolar();
    this.spherical = this.polar.map(c => {
      c.unshift(10);
      return Coordinate.spherical(c);
    });

    // 3. convert spherical coordinates to list of 3d cartesian points
    this.toCartesian3();
    this.footprint = this.cartesian3;
  }

  public toCartesian2(): void {
    this.cartesian2 = this.string.trim().split(',').map(coordinate => {
      let pair = coordinate.trim().split(' ');
      let x = parseFloat(pair[0]);
      let y = parseFloat(pair[1]);
      return Coordinate.cartesian([x,y]);
    });
  }

  public toPolar(): void {
    this.polar = this.cartesian2.map((coordinate: Coordinate) => {
      return coordinate.polar();
    });
  }

  public toCartesian3(): void {
    this.cartesian3 = this.spherical.map((coordinate: Coordinate) => {
      return coordinate.cartesian();
    });
  }
}
