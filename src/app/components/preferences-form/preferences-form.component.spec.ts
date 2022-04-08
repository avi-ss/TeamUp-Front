import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesFormComponent } from './preferences-form.component';

describe('PreferencesFormComponent', () => {
  let component: PreferencesFormComponent;
  let fixture: ComponentFixture<PreferencesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
