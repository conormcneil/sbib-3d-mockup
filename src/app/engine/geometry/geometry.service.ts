import { Injectable } from '@angular/core';
import { Coordinate, TripleNumArray, CartesianTuple } from 'coordinate-systems';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  public xyz: Coordinate;
  public spherical: Coordinate; // { radius, theta, phi }

  constructor() { }

  public toSpherical( coordinates: CartesianTuple ): Coordinate {
    // FROM cartesian
      // TO spherical

    this.xyz = Coordinate.cartesian( coordinates );

    return this.xyz;
  }

  public toCartesian( coordinates: TripleNumArray ): Coordinate {
    // FROM spherical
      // TO cartesian
    
    this.spherical = Coordinate.spherical( coordinates );
    
    return this.spherical;
  }
}
