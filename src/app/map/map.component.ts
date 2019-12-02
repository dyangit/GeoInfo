import { WeatherService } from './../services/weather.service';
import { MarkerService } from './../services/marker.service';
import { Component, OnInit, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';

// Stomp require typings issue
declare var require: any


// UUID configuration
const uuidv4 = require('uuid/v4');
const username = 'daniel';

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
  constructor(private marker : MarkerService,
              private weather : WeatherService) {
  }

  ngOnInit() {
    console.log("map component init");
  }
  
  ngAfterViewInit(){
    this.loadMap();
    this.map.on('click', (e) => {
        this.weather.coordinateVals = [e.latlng.lat, e.latlng.lng];

      //// Debug logs!
      //console.log(e);     
      //console.log(uuidv4());

      // AJAX call for user attribute logging
      $.ajax({
        url: 'https://hfzw9aa9dl.execute-api.us-west-2.amazonaws.com/prod/logging-function?username=' + username 
        + '&longitude=' 
        + e.latlng.lng + '&latitude=' 
        + e.latlng + '&PID=' 
        + uuidv4(),
        success: function(result) {
          $("#loaded").html("&#9989;");
          $("#cleared").html("");
        },
        error: function(error) {
          $("#loaded").html("&#10060;");
        },
        crossDomain : true
      });

      console.log(this.weather);
      this.weather.getWeatherFromLatLon();
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`<b>You clicked on [${e.latlng.lat}, ${e.latlng.lng}] </b> 
        <br> ${this.isNullEmptyOrUndefined(this.weather.getWeatherData())  ?
           `You have found this for the weather data: <br>` 
           + `<b>Name:</b> ${this.weather.getWeatherData().name}<br>`
           + `<b>Weather type:</b> ${this.weather.getWeatherData().weather[0].description}<br>`
           + `<b>Temperature:</b> ${this.weather.getWeatherData().main.temp}<br>`
           + `<b>Pressure:</b> ${this.weather.getWeatherData().main.pressure}<br>`
           + `<b>Humidity:</b> ${this.weather.getWeatherData().main.humidity}<br>`
           + `<b>Wind:</b> ${this.weather.getWeatherData().wind.speed}<br>`
            : 'Weather data is not defined'}`
        )
        .openOn(this.map);        
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
       attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> made by Daniel Yan'
     });
     
     tiles.addTo(this.map);
     this.marker.makeCapitalMarkers(this.map);
  }
}
