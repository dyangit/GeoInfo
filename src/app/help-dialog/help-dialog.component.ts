import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from './../services/snackbar.service';
import { DialogData } from '../login/login.component'

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss']
})
export class HelpDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<HelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackbarService : SnackbarService) { }
  
    onNoClick(): void {
      this.dialogRef.close();
      this.snackbarService.openSnackBar('You closed the help dialog');
    }

    ngOnInit() {
  }

}
