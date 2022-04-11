import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Preferences } from 'src/app/models/Preferences';

@Component({
  selector: 'app-preferences-form-dialog',
  templateUrl: './preferences-form-dialog.component.html',
  styleUrls: ['./preferences-form-dialog.component.css']
})
export class PreferencesFormDialogComponent {
  preferencesForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PreferencesFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Preferences,
    private builder: FormBuilder
  ) {
    this.preferencesForm = this.builder.group({
      preferences: [],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
