import { PopupService } from './popup.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  // Generated geojson of US state capitals, based off https://xfront.com/us_states/
  capitals: string = '/assets/geojson_data/us_capital_lat_long.geojson';
  
  constructor(private http: HttpClient, private popup : PopupService) {
  }
  
  // If we have a population field this could be used
  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }
  makeCapitalMarkers(map: L.map): void {
    
    this.http.get(this.capitals).subscribe((res: any) => {
      const maxVal = Math.max(...res.features.map(x => x.properties.population), 0);
      var radiusVal;
      // console.log('MaxVal: ' + maxVal);
      for (const c of res.features) {
        const lat = c.geometry.coordinates[0];
        const long = c.geometry.coordinates[1];
        // Add each marker to map
        
        // Marker types
        // const marker = L.marker([lat, long]).addTo(map);
        // Check if the population val was used or not
        (maxVal) ? radiusVal = MarkerService.scaledRadius(c.properties.population, radiusVal) : radiusVal = 10;
        const circleMarker = L.circleMarker([lat, long], {
          radius: radiusVal
        }).addTo(map);

        circleMarker.bindPopup(this.popup.makeCapitalPopup(c));

        circleMarker.addTo(map);
        // console.log('Lat: {0} Long: {1}', lat, long);
      }
    });
  }

}
