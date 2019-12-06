import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReversegeosearchService {
  private geoData : any;
  private coords : any[];
  
  constructor(private http : HttpClient) {
   }

   getGeoReverseFromLatLon()  {
    // console.log('center: ' + this.coordinateVals);
    var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' 
    + this.coords[0] + '&lon=' + this.coords[1] + '&zoom=18&addressdetails=1';
    //console.log('geo url: ' + url);
    this.geoReverseHTTPGet(url);
  }

  geoReverseHTTPGet(url : string){
    // console.log("url: " + url);
    return this.http.get<any[]>(url).subscribe({
      next: (data ) => {
        this.geoData = JSON.parse(JSON.stringify(data));
      },
      error: () => {
        console.log('error in http get ')
      },
      complete: () => {
        //console.log(this.geoData);
        //console.log(JSON.stringify(this.geoData));
      },
    });
  }

  getGeoData(){
    return this.geoData;
  }

  setCoords(newCoords : any[]){
    this.coords = newCoords;
  }

  getCoords(){
    return this.coords;
  }

}
