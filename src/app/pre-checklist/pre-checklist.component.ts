import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PreChecklistService } from '../pre-checklist.service';

@Component({
  selector: 'app-pre-checklist',
  templateUrl: './pre-checklist.component.html',
  styleUrls: ['./pre-checklist.component.css']
})
export class PreChecklistComponent implements OnInit {
  preChecklistForm: FormGroup;
  preChecklistId: number | null = null;
  bookingId: number | null = null;

  states = ['Compliant', 'Not-Compliant', 'Not-Applicable'];

  checkboxes = [
    { label: 'Oil Leaks', formControlName: 'oilLeaks' },
    { label: 'Fuel Level', formControlName: 'fuelLevel' },
    { label: 'Mirrors', formControlName: 'mirrors' },
    { label: 'Sun Visor', formControlName: 'sunVisor' },
    { label: 'Seat Belts', formControlName: 'seatBelts' },
    { label: 'Head Lights', formControlName: 'headLights' },
    { label: 'Indicators', formControlName: 'indicators' },
    { label: 'Park Lights', formControlName: 'parkLights' },
    { label: 'Brake Lights', formControlName: 'brakeLights' },
    { label: 'Strobe Light', formControlName: 'strobeLight' },
    { label: 'Reverse Light', formControlName: 'reverseLight' },
    { label: 'Reverse Hooter', formControlName: 'reverseHooter' },
    { label: 'Horn', formControlName: 'horn' },
    { label: 'Windscreen Wiper', formControlName: 'windscreenWiper' },
    { label: 'Tyre Condition', formControlName: 'tyreCondition' },
    { label: 'Spare Wheel Present', formControlName: 'spareWheelPresent' },
    { label: 'Jack and Wheel Spanner Present', formControlName: 'jackAndWheelSpannerPresent' },
    { label: 'Brakes', formControlName: 'brakes' },
    { label: 'Handbrake', formControlName: 'handbrake' },
    { label: 'JW Marketing Magnets', formControlName: 'jwMarketingMagnets' },
    { label: 'Checked By JW Security', formControlName: 'checkedByJWSecurity' },
    { label: 'License Disk Valid', formControlName: 'licenseDiskValid', required: true }
  ];

  constructor(
    private fb: FormBuilder,
    private preChecklistService: PreChecklistService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.preChecklistForm = this.fb.group({
      openingKms: [0, [Validators.required, this.nonNegativeValidator]],
      comments: [''],
      additionalComments: [''],
      bookingId: [null, Validators.required],
      preChecklistId: [null]
    });

    // Add form controls dynamically for each checklist item with validation
    this.checkboxes.forEach(check => {
      this.preChecklistForm.addControl(
        check.formControlName,
        this.fb.control(null, check.required ? Validators.required : [])
      );
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingId = +params['bookingId'];
      if (this.bookingId) {
        this.preChecklistForm.patchValue({ bookingId: this.bookingId });
      }
    });
  }

  onSubmit() {
    const openingKmsControl = this.preChecklistForm.get('openingKms');
    const licenseDiskControl = this.preChecklistForm.get('licenseDiskValid');
  
    if (openingKmsControl?.hasError('nonNegative')) {
      // Prevent submission and log (or you can show UI error - you already do in template)
      console.log('Opening kms should be positive');
      return;  // Prevent submission
    }
  
    if (!licenseDiskControl?.value) {
      console.log('License disk must be valid.');
      return;
    }
  
    if (this.preChecklistForm.valid) {
      this.preChecklistService.createPreChecklist(this.preChecklistForm.value)
        .subscribe(
          (response: any) => {
            if (response && response.id) {
              this.preChecklistId = response.id;
              this.router.navigate(['/create-trip'], {
                queryParams: {
                  preChecklistId: this.preChecklistId,
                  bookingId: this.bookingId
                }
              });
            } else {
              console.error('Id is missing in the response');
            }
          },
          (error) => {
            console.error('Error submitting checklist', error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }
  

  checkAll(state: string) {
    this.checkboxes.forEach(check => {
      const control = this.preChecklistForm.get(check.formControlName);
      if (control) {
        control.setValue(state);
      }
    });
  }

  nonNegativeValidator(control: AbstractControl) {
    const value = control.value;
    return value >= 0 ? null : { nonNegative: true };
  }
}
