import { TestBed } from '@angular/core/testing';

import { GeometryService } from './geometry.service';

describe('GeometryService', () => {
  let service: GeometryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeometryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should convert CARTESIAN to SPHERICAL coordinates', () => {
    let spherical, cartesian;

    it('should convert [ 0, 0, 0 ]', () => {
      spherical = service.toSpherical( [ 0, 0, 0 ] ).coordinates;
      cartesian = [ 0, 0, 0 ];
      expect(spherical).toEqual(cartesian);
    });
  });

  describe('should convert SPHERICAL to CARTESIAN coordinates', () => {
    let spherical, cartesian;

    it('should convert [ 0, 0, 0 ]', () => {
      cartesian = service.toCartesian( [ 0, 0, 0 ] ).coordinates;
      spherical = [ 0, 0, 0 ];
      expect(cartesian).toEqual(spherical);
    })
  })
});
