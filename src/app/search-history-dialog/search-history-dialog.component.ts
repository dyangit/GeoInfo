import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SearchResultData } from '../dialog-options/dialog-options.component';
// Sorting and filtering has not been added as new table source has issues
import { MatSort } from '@angular/material/sort';

  @Component({
  selector: 'app-search-history-dialog',
  templateUrl: './search-history-dialog.component.html',
  styleUrls: ['./search-history-dialog.component.scss']
})
export class SearchHistoryDialogComponent implements OnInit {

  displayedColumns: string[] = ['username', 'latitude', 'longitude', 'pid'];
  dataSource = [];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) public data: SearchResultData[]) { 
    this.dataSource = this.data;
    //// Printing the value of the data source
    // this.dataSource.forEach(e => {
    //   console.log('value in datasource: ' + JSON.stringify(e));
    // });
  }

  ngOnInit() {
  }
}
