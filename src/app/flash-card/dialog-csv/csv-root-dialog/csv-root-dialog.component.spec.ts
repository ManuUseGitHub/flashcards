import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvRootDialogComponent } from './csv-root-dialog.component';

describe('CsvRootDialogComponent', () => {
  let component: CsvRootDialogComponent;
  let fixture: ComponentFixture<CsvRootDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CsvRootDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvRootDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
