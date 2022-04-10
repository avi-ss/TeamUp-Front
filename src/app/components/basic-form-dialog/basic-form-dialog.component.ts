import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasicInfoData } from 'src/app/models/BasicInformation';

@Component({
  selector: 'app-basic-form-dialog',
  templateUrl: './basic-form-dialog.component.html',
  styleUrls: ['./basic-form-dialog.component.css'],
})
export class BasicFormDialogComponent {
  basicForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BasicFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BasicInfoData,
    private builder: FormBuilder
  ) {
    this.basicForm = this.builder.group({
      basic: [],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
