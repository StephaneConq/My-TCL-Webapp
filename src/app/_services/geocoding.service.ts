import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  // @ts-ignore
  geocoder: google.maps.Geocoder = null;

  constructor() {
    // @ts-ignore
    this.geocoder = new google.maps.Geocoder();
  }

  geocode(address: string): Promise<google.maps.GeocoderResult[]> {
    return new Promise(resolve => {
      this.geocoder.geocode({address}, (results, status) => {
        console.log('results', results);
        console.log('status', status);
        resolve(results);
      })
    })
  }
}
