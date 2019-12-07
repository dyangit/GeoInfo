import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SearchResultData } from '../dialog-options/dialog-options.component';
// Sorting and filtering has not been added as new table source has issues
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

  @Component({
  selector: 'app-search-history-dialog',
  templateUrl: './search-history-dialog.component.html',
  styleUrls: ['./search-history-dialog.component.scss']
})
export class SearchHistoryDialogComponent implements OnInit {
  filterValue = '';

  displayedColumns: string[] = ['username', 'latitude', 'longitude', 'pid'];
  dataSource =  new MatTableDataSource<SearchResultData>([]);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public data: SearchResultData[]) { 
    this.dataSource.data = this.data;
    //// Printing the value of the data source
    // this.dataSource.forEach(e => {
    //   console.log('value in datasource: ' + JSON.stringify(e));
    // });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilterValue(){
    this.filterValue = '';
    this.applyFilter(this.filterValue);
  }
}
