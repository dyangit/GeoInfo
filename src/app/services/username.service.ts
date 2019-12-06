import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {

  constructor() { }
  // default username
  public username = 'guest';
}
