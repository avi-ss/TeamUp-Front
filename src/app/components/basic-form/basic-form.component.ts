import { Component, forwardRef, Input, OnInit, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
  Validators,
  NG_VALIDATORS,
  FormControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { BasicInfoData } from 'src/app/models/BasicInformation';
import { Gender } from 'src/app/models/Gender';

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BasicFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BasicFormComponent),
      multi: true,
    },
  ],
})
export class BasicFormComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() data: BasicInfoData = { fullname: '', birthday: '', gender: '' };
  form: FormGroup = this.builder.group({});
  subscriptions: Subscription[] = [];
  genders: Gender[] = [
    { name: 'Masculine', value: 'MASC' },
    { name: 'Feminine', value: 'FEM' },
    { name: 'Other', value: 'OTHER' },
  ];
  maxDate: Date = new Date();

  get value(): BasicInfoData {
    return this.form.value;
  }

  set value(value: BasicInfoData) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get fullname() {
    return this.form.get('fullname');
  }

  get birthday() {
    return this.form.get('birthday');
  }

  get gender() {
    return this.form.get('gender');
  }

  constructor(private builder: FormBuilder) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 16);
    this.maxDate = currentDate;
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      fullname: [
        this.data.fullname,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z][a-z]*(\\s[A-Z][a-z]*)?'),
        ],
      ],
      birthday: [this.data.birthday, [Validators.required]],
      gender: [this.data.gender.toLowerCase(), [Validators.required]],
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.form.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.form.valid ? null : { profile: { valid: false } };
  }
}
