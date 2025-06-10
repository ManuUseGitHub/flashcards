import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecideCSVDialogComponent } from './decide-csvdialog.component';

describe('DecideCSVDialogComponent', () => {
  let component: DecideCSVDialogComponent;
  let fixture: ComponentFixture<DecideCSVDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DecideCSVDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecideCSVDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
