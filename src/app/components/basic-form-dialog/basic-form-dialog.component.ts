import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasicInfoData } from 'src/app/models/BasicInformation';

@Component({
  selector: 'app-basic-form-dialog',
  templateUrl: './basic-form-dialog.component.html',
  styleUrls: ['./basic-form-dialog.component.css'],
})
export class BasicFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BasicFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BasicInfoData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
