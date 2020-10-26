import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FootprintService {
  private string: String;
  public footprint: Array<any>;
  public list: Array<any>;
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
    // Ceres
    this.string = ' 209.5 -14.1, 209.6 -15.1, 209.7 -16.0, 209.7 -17.0, 209.7 -17.2, 205.7 -11.3, 202.2 -7.1, 202.2 -5.7, 202.3 -4.4, 202.3 -3.1, 202.3 -2.8, 206.3 -8.6, 209.5 -14.1';

    // once string is loaded,
    // convert to spherical coordinates and store output as `footprint` (default)
    this.convert();
  }

  public convert(): void {
    // input: footprint string
    this.toList();

    // 2. convert list of lat/lon points to spherical coordinates
    this.toSpherical();
    this.footprint = this.spherical;
  }

  public toList(): void {
    this.list = this.string.trim().split(',').map(coordinate => {
      let pair = coordinate.trim().split(' ');
      let lat = parseFloat(pair[0]);
      let lon = parseFloat(pair[1]);
      return [lat,lon];
    });
  }

  public toSpherical(): void {
    this.spherical = this.list.map((coordinate) => {
      const radius = 10; // can be any length
      const theta  = 90 - coordinate[0];
      const phi    = coordinate[1];
      return [ radius , theta, phi ];
    });
  }
}
