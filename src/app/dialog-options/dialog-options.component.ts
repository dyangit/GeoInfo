import { SnackbarService } from './../services/snackbar.service';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as $ from 'jquery';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-dialog-options',
  templateUrl: './dialog-options.component.html',
  styleUrls: ['./dialog-options.component.scss']
})


export class DialogOptionsComponent implements OnInit {
  getValue = '';
  deleteValue = '';
  constructor(
    public dialogRef: MatDialogRef<DialogOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackbarService : SnackbarService) { }
    
    ngOnInit() {
    }
    
    onNoClick(): void {
      this.dialogRef.close();
      this.snackbarService.openSnackBar('You closed the options dialog');
    }

    // AJAX call to GET logs by a username
    getLogsByUsername(username : string){
      // AJAX uses this instance to represent AJAX object not class instance, copying class instance to local var
      var self = this;
      $.ajax({
        url: 'https://hfzw9aa9dl.execute-api.us-west-2.amazonaws.com/prod/get_log_data?username=' + username,
        success: function(result) {
          self.snackbarService.openSnackBar('Successfully got user search history!');
          // TODO: DISPLAY RESULTS...?
          $("#loaded").html("&#9989;");
          $("#cleared").html("");
        },
        error: function(error) {
          self.snackbarService.openSnackBar('Error in retrieving user search history');
          $("#loaded").html("&#10060;");
        },
        crossDomain : true
      });
    }
    
    // AJAX call for delete logs by specified username
    deleteLogsByUsername(username : string){
      // AJAX uses this instance to represent AJAX object not class instance, copying class instance to local var
      var self = this;
      $.ajax({
        url: 'https://hfzw9aa9dl.execute-api.us-west-2.amazonaws.com/prod/remove_logs_for_user?username=' + username,
        success: function(result) {
          self.snackbarService.openSnackBar('Successfully deleted user search history!');
          $("#loaded").html("&#9989;");
          $("#cleared").html("");
        },
        error: function(error) {
          self.snackbarService.openSnackBar('Error in deleting user search history');
          $("#loaded").html("&#10060;");
        },
        crossDomain : true
      });
    }
    
    // AJAX call for delete all logs
    deleteAllLogs(){
      // AJAX uses this instance to represent AJAX object not class instance, copying class instance to local var
      var self = this;
      $.ajax({
        url: 'https://hfzw9aa9dl.execute-api.us-west-2.amazonaws.com/prod/remove_all_logs',
        success: function(result) {
          self.snackbarService.openSnackBar('Successfully deleted all search history!');
          $("#loaded").html("&#9989;");
          $("#cleared").html("");
        },
        error: function(error) {
          self.snackbarService.openSnackBar('Error in deleting all search history');
          $("#loaded").html("&#10060;");
        },
        crossDomain : true
      });
    }
}