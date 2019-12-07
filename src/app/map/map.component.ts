import { Component, OnInit, AfterViewInit} from '@angular/core';

import { SnackbarService } from './../services/snackbar.service';
import { UsernameService } from './../services/username.service';
import { WeatherService } from './../services/weather.service';
import { MarkerService } from './../services/marker.service';
import { ReversegeosearchService } from '../services/reversegeosearch.service';

import { DialogOptionsComponent } from '../dialog-options/dialog-options.component';
import { LoginComponent } from '../login/login.component';

import * as L from 'leaflet';
import * as $ from 'jquery';
import { Observable,  forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

// Stomp require typings issue
declare var require: any;


// UUID configuration
const uuidv4 = require('uuid/v4');

// Setting marker
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map;

  constructor(private dialog : MatDialog,
              private weather : WeatherService,
              private georeverse : ReversegeosearchService,
              public usernameService : UsernameService,
              private snackBarService : SnackbarService,
              private marker : MarkerService) {}

  ngOnInit() {
    // console.log("map component init");
  }

  

openOptions(): void {
  const dialogRef = this.dialog.open(DialogOptionsComponent, {
    width: '400px',
    data: {
      name: this.usernameService.username
    }
  });
  // After closed result
  dialogRef.afterClosed().subscribe(result => {
  });
}

loginUser(){
  const dialogRef = this.dialog.open(LoginComponent, {
    width: '400px',
    data: {
      name: this.usernameService.username
    }
  });
  // After closed result
  dialogRef.afterClosed().subscribe(result => {
  });
}
 
// Map functionalities
  ngAfterViewInit(){
    this.loadMap();
    this.map.on('click', (e) => {
      this.weather.coordinateVals = [e.latlng.lat, e.latlng.lng];
      this.georeverse.setCoords(this.weather.coordinateVals);

      // Copy this object to a local var to not confuse AJAX this
      var self = this;
      
      //// Debug logs!
      // console.log(e);     

      //AJAX call for user attribute logging
      $.ajax({
        url: 'https://hfzw9aa9dl.execute-api.us-west-2.amazonaws.com/prod/logging-function?username=' + self.usernameService.username 
        + '&longitude=' 
        + e.latlng.lng + '&latitude=' 
        + e.latlng.lat + '&PID=' 
        + uuidv4(),
        success: function(result) {
          //console.log('ajax call result' + result);
          $("#loaded").html("&#9989;");
          $("#cleared").html("");
        },
        error: function(error) {
          $("#loaded").html("&#10060;");
        },
        crossDomain : true
      });

       this.getAPIData().subscribe( res => {
        this.map.openPopup(this.makePopup(e));

        // This draws a red polygon line from the end of the map to clicked point
        // console.log(this.georeverse.getGeoData().boundingbox);
        // if(this.georeverse.getGeoData().boundingbox) {
        //   var latlngs = [];
        //   for (var i = 0; i < this.georeverse.getGeoData().boundingbox.length; i++) {
        //     latlngs.push(L.latLng(Number(this.georeverse.getGeoData().boundingbox[i]), this.georeverse.getGeoData().lon));
        //   }
        //   latlngs.forEach(element => {
        //       console.log(element);
        //   });
        //   var polyline = L.polyline(latlngs, {color: 'red'}).addTo(this.map);
        //   // zoom the map to the polyline
        //   //this.map.fitBounds(polyline.getBounds());
        // }

       }),
       err => {
         this.snackBarService.openSnackBar('Error in calling mouse click');
       }
      });
  }

  // Weather data is a lot more likely to be defined comparative to geodata, so weather is checked
  makePopup(e) : any{
  return   L.popup()
          .setLatLng(e.latlng)
          .setContent(`<b>[Lat/Long]<br>[${e.latlng.lat}, ${e.latlng.lng}] </b> 
          <br> ${this.isNullEmptyOrUndefined(this.weather.getWeatherData())  ?
              `${this.printWeather()} <br> ${this.printGeoData()}` : 'Weather data is not defined'}`
          );
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

   getAPIData(): Observable<any>{
    return forkJoin(this.weather.weatherHTTPGet(), this.georeverse.geoReverseHTTPGet());
  }
  
  private isNullEmptyOrUndefined(val : any[]) : boolean {
    // as val will change into a Object type length becomes undefined
      return (val !== null && val !== undefined && val.length === undefined) ? true : false;
  }

  private initMap() {
    this.map = L.map('map', {
      //UWB lat long: 47.759215471734, -122.190639104652
      // Rough US center based on https://www.findlatitudeandlongitude.com/?loc=center+of+the+united+states
      center: L.latLng(this.weather.coordinateVals[0], this.weather.coordinateVals[1]),
      zoom: 5
    });
  }

  private loadMap() {
     // Map div must exist in the DOM first
     this.initMap();
     const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       // Max zoom is 18 https://leafletjs.com/reference-1.6.0.html#tilelayer-option
       maxZoom: 18,
       attribution: 'Map tiles provided by &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <br> Made by <a href="https://github.com/Dudedmn">Daniel Yan</a> & <a href="https://github.com/mdsouza176">Melroy Dsouza</a>'
     });
     
     tiles.addTo(this.map);
     this.marker.makeCapitalMarkers(this.map);
  }

  // Prints for popups

  // Print particular weather attributes
  private printWeather() : string {
    var weatherInfo = `<br>The following weather information has been retrieved:<br><br>`;

    if(this.weather.getWeatherData().name){
      weatherInfo += `<b>Name:</b> ${this.weather.getWeatherData().name}<br>`;
    }
    if(this.weather.getWeatherData().weather[0].description){
      weatherInfo += `<b>Weather type:</b> ${this.weather.getWeatherData().weather[0].description}<br>`
    }
    if(this.weather.getWeatherData().main.temp){
      weatherInfo += `<b>Temperature:</b> ${this.weather.getWeatherData().main.temp} °F<br>`
    }
    if(this.weather.getWeatherData().main.pressure){
      weatherInfo += `<b>Pressure:</b> ${this.weather.getWeatherData().main.pressure} hPa<br>`
    }
    if(this.weather.getWeatherData().main.humidity){
      weatherInfo += `<b>Humidity:</b> ${this.weather.getWeatherData().main.humidity} %<br>`
    }
    if(this.weather.getWeatherData().wind.speed){
      weatherInfo += `<b>Wind:</b> ${this.weather.getWeatherData().wind.speed} mph<br>`;
    }
    return weatherInfo;
  }
  
  private printGeoData() : string {
    var geoData = `<br> The following geodata information has been retrieved:<br><br>`
    // console.log('print: ' + this.georeverse.getGeoData());
    if(this.georeverse.getGeoData().display_name)
      geoData += `<b>Address: </b> ${this.georeverse.getGeoData().display_name}<br>` 
    else
      geoData = 'Geodata couldn\'t be retrieved for this area';
    return geoData;
  }
}
