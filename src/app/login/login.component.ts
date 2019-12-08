import { SnackbarService } from './../services/snackbar.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsernameService } from './../services/username.service';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userValue='';
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private usernameService: UsernameService,
    private snackbarService : SnackbarService) { }
    
  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  setUsername(username : string) {    
    this.usernameService.username = username;
    this.snackbarService.openSnackBar('You set username to \'' + this.usernameService.username + '\'. Please close the dialog.');
  }

}
