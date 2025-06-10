import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileCSVDialogComponent } from './file-csvdialog.component';

describe('FileCSVDialogComponent', () => {
  let component: FileCSVDialogComponent;
  let fixture: ComponentFixture<FileCSVDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileCSVDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileCSVDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
