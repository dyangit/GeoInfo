import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHistoryDialogComponent } from './search-history-dialog.component';

describe('SearchHistoryDialogComponent', () => {
  let component: SearchHistoryDialogComponent;
  let fixture: ComponentFixture<SearchHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
