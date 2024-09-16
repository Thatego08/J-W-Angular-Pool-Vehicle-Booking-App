import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PreChecklistService } from '../pre-checklist.service';

@Component({
  selector: 'app-pre-checklist',
  templateUrl: './pre-checklist.component.html',
  styleUrls: ['./pre-checklist.component.css']
})
export class PreChecklistComponent implements OnInit {
  preChecklistForm: FormGroup;
  bookingId: number | null = null;
  preChecklistId: number | null = null;

  // Checkbox definitions
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
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.preChecklistForm = this.fb.group({
      openingKms: [0, [Validators.required, this.nonNegativeValidator]],
      oilLeaks: [false],
      fuelLevel: [false],
      mirrors: [false],
      sunVisor: [false],
      seatBelts: [false],
      headLights: [false],
      indicators: [false],
      parkLights: [false],
      brakeLights: [false],
      strobeLight: [false],
      reverseLight: [false],
      reverseHooter: [false],
      horn: [false],
      windscreenWiper: [false],
      tyreCondition: [false],
      spareWheelPresent: [false],
      jackAndWheelSpannerPresent: [false],
      brakes: [false],
      handbrake: [false],
      jwMarketingMagnets: [false],
      checkedByJWSecurity: [false],
      licenseDiskValid: [false, Validators.requiredTrue], // Set the licenseDiskValid as required
      comments: [''],
      additionalComments: [''],
      preChecklistId: [null]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['bookingId']) {
        this.bookingId = +params['bookingId'];
      }
    });
  }

  onSubmit() {
    if (this.preChecklistForm.valid) {
      this.preChecklistService.createPreChecklist(this.preChecklistForm.value)
        .subscribe(
          (response: any) => {
            this.preChecklistId = response.preChecklistId;
            this.preChecklistForm.get('preChecklistId')?.setValue(this.preChecklistId);
            if (this.bookingId) {
              this.router.navigate(['/create-trip'], { queryParams: { preChecklistId: this.preChecklistId, bookingId: this.bookingId } });
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

  checkAll(checked: boolean) {
    this.checkboxes.forEach(check => {
      const control = this.preChecklistForm.get(check.formControlName);
      if (control) {
        control.setValue(checked);
      }
    });
  }

  nonNegativeValidator(control: AbstractControl) {
    const value = control.value;
    return value >= 0 ? null : { nonNegative: true };
  }
}
