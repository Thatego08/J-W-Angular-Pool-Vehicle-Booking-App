import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rate-form',
  templateUrl: './rate-form.component.html',
  styleUrl: './rate-form.component.css'
})
export class RateFormComponent {
  rateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.rateForm = this.fb.group({
      rateTypeName: [data.rate ? data.rate.rateTypeName : '', Validators.required],
      rateValue: [data.rate ? data.rate.rateValue : '', Validators.required],
      projectNumber: [data.rate ? data.rate.projectNumber : '', Validators.required],
      applicableTimePeriod: [data.rate ? data.rate.applicableTimePeriod : ''],
      conditions: [data.rate ? data.rate.conditions : '']
    });
  }

  onSubmit(): void {
    if (this.rateForm.valid) {
      this.dialogRef.close(this.rateForm.value);
    }
}

onCancel(): void {
  this.dialogRef.close();
}
}
