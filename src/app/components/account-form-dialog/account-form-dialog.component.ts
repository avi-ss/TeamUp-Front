import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountInfoData } from 'src/app/models/AccountInformation';

@Component({
  selector: 'app-account-form-dialog',
  templateUrl: './account-form-dialog.component.html',
  styleUrls: ['./account-form-dialog.component.css'],
})
export class AccountFormDialogComponent {
  accountForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AccountFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountInfoData,
    private builder: FormBuilder
  ) {
    this.accountForm = this.builder.group({
      account: [],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
