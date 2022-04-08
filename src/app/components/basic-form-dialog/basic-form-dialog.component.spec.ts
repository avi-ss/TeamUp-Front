import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFormDialogComponent } from './basic-form-dialog.component';

describe('BasicFormDialogComponent', () => {
  let component: BasicFormDialogComponent;
  let fixture: ComponentFixture<BasicFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
