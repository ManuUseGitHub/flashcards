import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCSVDialogComponent } from './create-csvdialog.component';

describe('CreateCSVDialogComponent', () => {
  let component: CreateCSVDialogComponent;
  let fixture: ComponentFixture<CreateCSVDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCSVDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCSVDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
