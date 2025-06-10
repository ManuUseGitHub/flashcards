import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvConfigAutomationDialogComponent } from './csv-config-automation-dialog.component';

describe('CsvConfigAutomationDialogComponent', () => {
  let component: CsvConfigAutomationDialogComponent;
  let fixture: ComponentFixture<CsvConfigAutomationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CsvConfigAutomationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvConfigAutomationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
