import { Component, Inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-create-team-dialog',
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.css']
})
export class CreateTeamDialogComponent {

  // Form to check the name is correct
  teamNameForm: FormGroup = this.builder.group({});
  teamNameErrorMessage: string = "";

  constructor(
    public dialogRef: MatDialogRef<CreateTeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private builder: FormBuilder,
    private teamService: TeamService,
  ) {
    this.teamNameForm = this.builder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(16),
          Validators.pattern('^[^0-9\\\\]\\w+$'),
        ],
        [this.teamNameValidator()],
      ]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get name() {
    return this.teamNameForm.get("name");
  }

  get teamName() {
    return this.name?.value;
  }

  private teamNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.teamService.checkTeamWithName(control.value).pipe(
        map((response: boolean) => {
          if (response) {
            return { teamNameUsed: true };
          }
          return null;
        })
      );
  }

  getTeamNameErrorMessage() {
    if (this.teamNameForm != null) {
      if (this.name?.hasError('required')) {
        this.teamNameErrorMessage = 'You must enter a nickname';
        return true;
      } else if (this.name?.hasError('minlength')) {
        this.teamNameErrorMessage = 'Minimum of 5 characters';
        return true;
      } else if (this.name?.hasError('maxlenght')) {
        this.teamNameErrorMessage = 'Maximum of 16 characters';
        return true;
      } else if (this.name?.hasError('teamNameUsed')) {
        this.teamNameErrorMessage = 'Nickname already in use';
        return true;
      } else if (this.name?.hasError('pattern')) {
        this.teamNameErrorMessage = 'Only letters and numbers';
        return true;
      }
    }
    this.teamNameErrorMessage = '';
    return false;
  }
}
