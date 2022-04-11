import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesFormDialogComponent } from './preferences-form-dialog.component';

describe('PreferencesFormDialogComponent', () => {
  let component: PreferencesFormDialogComponent;
  let fixture: ComponentFixture<PreferencesFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencesFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
