import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  public APIKEY = '/assets/apikey.json';

  constructor(private http : HttpClient) {
    this.http.get(this.APIKEY).subscribe((res: any) => {
        this.APIKEY = res.APIKEY;
    });
  }

  getWeatherFromLatLon(lat : Number, lon : Number) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' 
    + lat + '&lon=' + lon + '&' + this.APIKEY;

    return this.http.get<HttpResponse<Object>>(url, {observe: 'response'}).pipe(
      tap(resp => console.log('response', resp))
    );
  }
}
