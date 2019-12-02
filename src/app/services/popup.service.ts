import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

  
  makeCapitalPopup(data: any) : string {
    // data = JSON.stringify(data);
    //console.log('Data{0}', data);
    return '' +
      `<div> <b>Capital:</b> ${ data.properties.Capital }</div>` +
      `<div> <b>State:</b> ${ data.properties.State }</div>` +
      `<div> <b>Lat/Long:</b> [${ data.geometry.coordinates[0] }, ${ data.geometry.coordinates[1] }] </div>`
  }
}
