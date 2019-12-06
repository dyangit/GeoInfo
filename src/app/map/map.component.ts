import { Component, OnInit, AfterViewInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UsernameService } from './../services/username.service';
import { WeatherService } from './../services/weather.service';
import { MarkerService } from './../services/marker.service';
import { ReversegeosearchService } from '../services/reversegeosearch.service';

import { DialogOptionsComponent } from '../dialog-options/dialog-options.component';
import { LoginComponent } from '../login/login.component';

import * as L from 'leaflet';
import * as $ from 'jquery';

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
  private numClicks = 0;
  private map;
  constructor(private marker : MarkerService,
              private weather : WeatherService,
              private georeverse : ReversegeosearchService,
              private usernameService : UsernameService,
              private dialog : MatDialog) {}

  ngOnInit() {
    // console.log("map component init");
  }
  
  ngAfterViewInit(){
    this.loadMap();
    this.map.on('click', (e) => {
      this.numClicks++;  
      this.weather.coordinateVals = [e.latlng.lat, e.latlng.lng];
      this.georeverse.setCoords(this.weather.coordinateVals);

      // Copy this object to a local var to not confuse AJAX this
      var self = this;
      
      //// Debug logs!
      //console.log(e);     
      //console.log(uuidv4());

      // AJAX call for user attribute logging
      $.ajax({
        url: 'https://hfzw9aa9dl.execute-api.us-west-2.amazonaws.com/prod/logging-function?username=' + self.usernameService.username 
        + '&longitude=' 
        + e.latlng.lng + '&latitude=' 
        + e.latlng + '&PID=' 
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

      // $.ajax({
      //     url: `${self.weather.getWeatherFromLatLon()} ${self.georeverse.getGeoReverseFromLatLon()}`,
      //     async: true,
      //     success: function(){
      //     L.popup()
      //     .setLatLng(e.latlng)
      //     .setContent(
      //         `<br>numClicks: ${self.numClicks}<br><b>[Lat/Long]<br>[${e.latlng.lat}, ${e.latlng.lng}] </b> 
      //         <br> ${self.isNullEmptyOrUndefined(self.weather.getWeatherData())  ?
      //         `${self.printWeather()} <br> ${self.printGeoData()}` : 'Weather data is not defined'}`
      //       )
      //     .openOn(self.map)        
      //   }
      // });

      // console.log(this.weather);
      //console.log(this.georeverse.getGeoData())
      //this.weather.getWeatherFromLatLon();
      //this.georeverse.getGeoReverseFromLatLon();
      // console.log(this.georeverse.getCoords());
      this.weather.getWeatherFromLatLon();
      this.georeverse.getGeoReverseFromLatLon();
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`<br>numClicks: ${this.numClicks}<br><b>[Lat/Long]<br>[${e.latlng.lat}, ${e.latlng.lng}] </b> 
        <br> ${this.isNullEmptyOrUndefined(this.weather.getWeatherData())  ?
            `${this.printWeather()} <br> ${this.printGeoData()}` : 'Weather data is not defined'}`
        )
        .openOn(this.map);        
      });
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
  private isNullEmptyOrUndefined(val : any[]) : boolean {
    // as val will change into a Object type length becomes undefined
      return (val !== null && val !== undefined && val.length === undefined) ? true : false;
  }

  private initMap() {
    this.map = L.map('map', {
      //UWB lat long: 47.759215471734, -122.190639104652
      // Rough US center based on https://www.findlatitudeandlongitude.com/?loc=center+of+the+united+states
      center: this.weather.coordinateVals,
      zoom: 5
    });
  }

  private loadMap() {
     // Map div must exist in the DOM first
     this.initMap();
     const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       // Max zoom is 18 https://leafletjs.com/reference-1.6.0.html#tilelayer-option
       maxZoom: 18,
       attribution: 'Map tiles provided by &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> made by Daniel Yan & Melroy Dsouza'
     });
     
     tiles.addTo(this.map);
     this.marker.makeCapitalMarkers(this.map);
  }

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
    var geoData = `<br> The following geodata information has been retrived:<br><br>`
    // console.log('print: ' + this.georeverse.getGeoData());
    if(this.georeverse.getGeoData().display_name) {
      geoData += `<b>Address: </b> ${this.georeverse.getGeoData().display_name}<br>` 
    }
    return geoData;
  }
}
