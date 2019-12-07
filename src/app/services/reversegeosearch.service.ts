import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ReversegeosearchService {
  private geoData : any;
  private coords : any[];
  
  constructor(private http : HttpClient,
              private snackBarService : SnackbarService) {
    this.geoData = [];
    this.coords = [ 42.877742, -97.380979 ];
    this.geoReverseHTTPGet();
   }

  async geoReverseHTTPGet(){
    var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' 
    + this.coords[0] + '&lon=' + this.coords[1] + '&zoom=18&addressdetails=1';
    // console.log("url: " + url);
    return this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.geoData = JSON.parse(JSON.stringify(data));
      },
      error: () => {
        this.snackBarService.openSnackBar('Error in HTTP GET for geo search data');
        console.log('error in HTTP get for geo search data');
      },
      complete: () => {
        //console.log('finished getting geodata');
        // console.log(this.geoData);
        // console.log(JSON.stringify(this.geoData));
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
