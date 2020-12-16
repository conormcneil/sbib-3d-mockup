import { Injectable } from '@angular/core';
import { ImageHandlerService } from './image-handler.service';
import SbibImage from './models/SbibImage';

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
  public api: any;
  public currentImage: SbibImage;

  constructor(private imageHandler: ImageHandlerService) {
    this.api = {
      'Ceres': {
        '589270800': ' 209.5 -14.1, 209.6 -15.1, 209.7 -16.0, 209.7 -17.0, 209.7 -17.2, 205.7 -11.3, 202.2 -7.1, 202.2 -5.7, 202.3 -4.4, 202.3 -3.1, 202.3 -2.8, 206.3 -8.6, 209.5 -14.1',
        '589368910': ' 207.8 -14.5, 207.9 -15.5, 208.0 -16.5, 208.1 -17.5, 208.1 -17.7, 204.2 -11.9, 200.6 -7.8, 200.6 -6.4, 200.6 -5.1, 200.6 -3.7, 200.6 -3.5, 204.7 -9.2, 207.8 -14.5',
        '0050444_16007170633F': ' 258.9 68.0, 262.5 66.7, 265.7 65.3, 267.1 64.6, 264.0 63.3, 261.1 62.0, 259.8 61.3, 256.8 62.5, 253.5 63.7, 251.7 64.2, 254.3 65.8, 257.3 67.3, 258.9 68.0',
      },
      '67P': {
        'n20160710t095836552id30f22': ' 124.7 37.5, 122.5 32.8, 119.8 27.6, 120.4 25.6, 108.2 22.3, 104.0 22.1, 100.7 21.3, 101.3 26.5, 100.1 30.5, 97.4 31.0, 117.6 38.7, 124.9 38.7, 124.7 37.5',
        'n20150812t135504593id30f71': ' 214.7 -3.6, 200.4 -17.7, 200.1 -58.9, 120.4 -88.7, 89.8 -70.7, 81.9 -45.4, 83.3 -14.4, 72.2 6.9, 18.3 -9.8, 16.1 6.5, 2.6 22.1, 0.0 23.3, 0.0 46.7, 0.0 70.2, 0.0 90.0, 360.0 90.0, 360.0 70.2, 360.0 46.7, 360.0 23.3, 341.2 31.9, 322.5 29.8, 304.8 15.3, 297.4 -1.1, 222.4 21.9, 215.4 5.4, 214.7 -3.6'
      }
    };
  }
  
  ngOnInit(): void {
    this.imageHandler.currentImage.subscribe(currentImage => {
      this.currentImage = currentImage;
      console.log(this.currentImage);
    });
  }

  public getFootprint(): void { 
    console.log(this.currentImage.imageName);
    console.log('faking API call to backend to retrieve footprint string...');
    
    // TEST FOOTPRINT STRINGS
    // 67P
    const imageName = this.currentImage.imageName;
    this.string = this.api['67P'][`${imageName}`];
    
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
