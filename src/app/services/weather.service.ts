import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService  {
  public APIKEY = '/assets/apikey.json';
  private weatherData : any;
  public coordinateVals = [ 42.877742, -97.380979 ];

  constructor(private http : HttpClient) {
    this.http.get(this.APIKEY).subscribe({
      next: (res: any) => {
        this.APIKEY = res.APIKEY
      },
      error: () => {
        console.log('error in http client')
      },
      complete: () => {
          this.weatherHTTPGet();
      },
    });
  }
  
  async weatherHTTPGet(){
    var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' 
    + this.coordinateVals[0] + '&lon=' + this.coordinateVals[1] + '&units=imperial&' + this.APIKEY;
    // console.log("url: " + url);
    return this.http.get<any[]>(url).subscribe({
      next: (data ) => {
        this.weatherData = JSON.parse(JSON.stringify(data));
      },
      error: () => {
        console.log('error in http get ')
      },
      complete: () => {
        //  console.log('finished getting weather');
        // if(this.weatherData)
        //   console.log('weatherData: ' + JSON.stringify(this.weatherData));
      },
    });
  }

  getWeatherData() {
    return this.weatherData;
  }
}
