import { WeatherService } from './../services/weather.service';
import { MarkerService } from './../services/marker.service';
import { Component, OnInit, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';

// Typings aren't working too well
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
export class MapComponent implements OnInit {
  private map;
  constructor(private marker : MarkerService,
              private weather : WeatherService) {

  }

  ngOnInit() {
    console.log("map component init");
  }
  
  ngAfterViewInit(){
    // Map div must exist in the DOM first
    this.initMap();
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // Max zoom is 18 https://leafletjs.com/reference-1.6.0.html#tilelayer-option
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> made by Daniel Yan'
    });
    
    tiles.addTo(this.map);
    this.marker.makeCapitalMarkers(this.map);
    //console.log(this.map);
    //console.log(this.weather.APIKEY);
    // copy of current map
    var mapCopy = this.map;
    var weatherCopy = this.weather;
    this.map.on('click', function(e) {
      // console.log(e);     
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
        headers: {
          'Access-Control-Allow-Origin' : 'Content-Type',
        }
      });
      var popLocation = e.latlng;
      console.log(JSON.stringify(weatherCopy.getWeatherFromLatLon(e.latlng.lat, e.latlng.lng)));
      console.log(weatherCopy);
      console.log(uuidv4());
      L.popup()
      .setLatLng(popLocation)
        .setContent(`<b>You clicked on [${e.latlng.lat}, ${e.latlng.lng}] </b>`)
        .openOn(mapCopy);        
      });
  }

  private initMap(): void {
    this.map = L.map('map', {
      //UWB lat long: 47.759215471734, -122.190639104652
      // Rough US center based on https://www.findlatitudeandlongitude.com/?loc=center+of+the+united+states
      center: [ 42.877742, -97.380979 ],
      zoom: 5
    });
  }
}
