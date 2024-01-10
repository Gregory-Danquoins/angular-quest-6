import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormBuilder,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isSubmitted = false;
  formBuilder: FormBuilder;
  sheets = ['short', 'long'];
  types = ['series', 'movie', 'episode'];
  signupForm: FormGroup;
  searchForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  get hobbyControls() {
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  constructor(formBuilder: FormBuilder) {
    this.formBuilder = formBuilder;
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      type: ['series'],
      releaseYear: [
        null,
        [this.rangeDateValidator(1900, new Date().getFullYear())],
      ],
      sheet: [null],

      // Nested FormGroup
      identity: this.formBuilder.group(
        {
          title: [''],
          identifier: [''],
        },
        { validator: this.isRequiredValidator('title', 'identifier') }
      ),
    });

    this.searchForm.valueChanges.subscribe((value) =>
      console.log('form change:', value)
    );
    // this.searchForm.statusChanges.subscribe((status) => console.log(status));

    this.searchForm.patchValue({
      sheet: 'short',
    });
  }

  isRequiredValidator(controlName1, controlName2): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value1 = control.get(controlName1).value;
      const value2 = control.get(controlName2).value;

      if (value1 === '' && value2 === '') {
        return {
          isRequired: { message: 'Either title or identifier is required' },
        };
      } else {
        return null;
      }
    };
  }

  rangeDateValidator(start, end): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const year = control.value;

      if (year < start || year > end) {
        return {
          min: {
            min: start,
            max: end,
            message: `Year must be between ${start} and ${end}`,
          },
        };
      } else {
        return null;
      }
    };
  }

  onSubmit() {
    this.isSubmitted = true;
    console.log('Your search :', JSON.stringify(this.searchForm.value));
    // this.searchForm.reset();
  }
}
