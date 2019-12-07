import { Component, OnInit, Inject} from '@angular/core';
import { SearchHistoryDialogComponent } from '../search-history-dialog/search-history-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from './../services/snackbar.service';
import { DialogData } from '../login/login.component'
import * as $ from 'jquery';

export interface SearchResultData {
  username: string;
  pid: string;
  lat: string;
  lon: string;
}

const searchHistoryS3Link = 'https://css436-test.s3-us-west-2.amazonaws.com/userSearchHistory.txt';

@Component({
  selector: 'app-dialog-options',
  templateUrl: './dialog-options.component.html',
  styleUrls: ['./dialog-options.component.scss']
})


export class DialogOptionsComponent implements OnInit {
  public searchData : SearchResultData[];
  getValue = '';
  deleteValue = '';


  constructor(
    public dialogRef: MatDialogRef<DialogOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackbarService : SnackbarService,
    private dialog : MatDialog) { }
    
    ngOnInit() {
      // Initialize array
      this.searchData = [];
    }
    
    onNoClick(): void {
      this.dialogRef.close();
      this.snackbarService.openSnackBar('You closed the options dialog');
    }

    viewAllLogs(){
      window.open(searchHistoryS3Link, "_blank");
    }

    // AJAX call to GET logs by a username
    getLogsByUsername(username : string){
      // AJAX uses this instance to represent AJAX object not class instance, copying class instance to local var
      var self = this;
      $.ajax({
        url: 'https://hfzw9aa9dl.execute-api.us-west-2.amazonaws.com/prod/get_log_data?username=' + username,
        // Hard-coded some status codes as AJAX error reporting seems overly sensitive        
        statusCode: {
          200: function(){
            self.snackbarService.openSnackBar('Successfully got user search history!');             
          },
          403: function(){
            self.snackbarService.openSnackBar('Error in deleting retrieving user search history, returned HTTP code 403');
          },
          404: function(){
            self.snackbarService.openSnackBar('Error in deleting retrieving user  search history, returned HTTP code 404');
          }
      },
        success: function(result) {
          self.snackbarService.openSnackBar('Successfully got user search history!');
          self.displaySearchResults(JSON.stringify(result));
          $("#loaded").html("&#9989;");
          $("#cleared").html("");
        },
        error: function(error) {
          // console.log('error in getLogsByUsername(): ' + JSON.stringify(error));
          self.snackbarService.openSnackBar('Error in retrieving user search history');
          $("#loaded").html("&#10060;");
        },
        crossDomain : true
      });
    }

    
    displaySearchResults(result: string) {
      // console.log(result);
      JSON.parse(result).forEach(data => {
        this.searchData.push({
        username: data.username,
        pid: data.PID,
        lat: data.latitude,
        lon: data.longitude
        })
      });

      const dialogRef = this.dialog.open(SearchHistoryDialogComponent, {
        width: '1000px',
        data: this.searchData
      });
      // After closed result
      dialogRef.afterClosed().subscribe(result => {
      });

      // this.searchData.forEach(e => {
      //   console.log('values of searchData' + JSON.stringify(e));
      // });
    }
    
    // AJAX call for delete logs by specified username
    deleteLogsByUsername(username : string){
      var self = this;
      $.ajax({
        url: 'https://hfzw9aa9dl.execute-api.us-west-2.amazonaws.com/prod/remove_logs_for_user?username=' + username,
        statusCode: {
          200: function(){
            self.snackbarService.openSnackBar('Successfully deleted user search history!');             
          },
          403: function(){
            self.snackbarService.openSnackBar('Error in deleting user search history, returned HTTP code 403');
          },
          404: function(){
            self.snackbarService.openSnackBar('Error in deleting user search history, returned HTTP code 404');
          }
      },
        success: function(result) {
          self.snackbarService.openSnackBar('Successfully deleted user search history!');
          $("#loaded").html("&#9989;");
          $("#cleared").html("");
        },
        error: function(error) {
          // console.log('error in deleteLogsByUsername(): ' + JSON.stringify(error));
          self.snackbarService.openSnackBar('Error in deleting user search history');
          $("#loaded").html("&#10060;");
        },
        crossDomain : true
      });
    }
    
    // AJAX call for delete all logs
    deleteAllLogs(){
      var self = this;
      $.ajax({
        url: 'https://hfzw9aa9dl.execute-api.us-west-2.amazonaws.com/prod/remove_all_logs',
        statusCode: {
            200: function(){
              self.snackbarService.openSnackBar('Successfully deleted all search history!');             
            },
            403: function(){
              self.snackbarService.openSnackBar('Error in deleting all search history, returned HTTP code 403');
            },
            404: function(){
              self.snackbarService.openSnackBar('Error in deleting all search history, returned HTTP code 404');
            }
        },
        success: function(result) {
          self.snackbarService.openSnackBar('Successfully deleted all search history!');
          $("#loaded").html("&#9989;");
          $("#cleared").html("");
        },
        error: function(error) {
          // console.log('error in deleteAllLogs(): ' + JSON.stringify(error));
          self.snackbarService.openSnackBar('Error in deleting all search history');
          $("#loaded").html("&#10060;");
        },
        crossDomain : true
      });
    }
}
