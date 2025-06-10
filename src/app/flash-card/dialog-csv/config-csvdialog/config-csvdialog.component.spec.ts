import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCSVDialogComponent } from './config-csvdialog.component';

describe('ConfigCSVDialogComponent', () => {
  let component: ConfigCSVDialogComponent;
  let fixture: ComponentFixture<ConfigCSVDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigCSVDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigCSVDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
