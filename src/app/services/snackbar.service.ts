import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// TTL of message in ms
const durationTime = 2000;

@Injectable({
  providedIn: 'root'
})

export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: durationTime,
    });
  }
}
