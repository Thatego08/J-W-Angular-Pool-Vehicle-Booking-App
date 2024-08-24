import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PreChecklistService } from '../pre-checklist.service';

@Component({
  selector: 'app-pre-checklist',
  templateUrl: './pre-checklist.component.html',
  styleUrls: ['./pre-checklist.component.css']
})
export class PreChecklistComponent implements OnInit {
  preChecklistForm: FormGroup;
  bookingId: number | null = null;

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
    { label: 'License Disk Valid', formControlName: 'licenseDiskValid' }
  ];

  constructor(
    private fb: FormBuilder,
    private preChecklistService: PreChecklistService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.preChecklistForm = this.fb.group({
      openingKms: [0],
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
      licenseDiskValid: [false],
      comments: [''],
      additionalComments: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['bookingId']) {
        this.bookingId = +params['bookingId']; // Parse bookingId
      }
    });
  }

  onSubmit() {
    this.preChecklistService.createPreChecklist(this.preChecklistForm.value)
      .subscribe(
        (response: any) => {
          const preChecklistId = response.preChecklistId; // Adjust based on actual response
          if (this.bookingId) {
            this.router.navigate(['/create-trip'], { queryParams: { preChecklistId: preChecklistId, bookingId: this.bookingId } });
          }
        },
        (error) => {
          console.error('Error submitting checklist', error);
        }
      );
  }

  // Method to check/uncheck all checkboxes
  checkAll(checked: boolean) {
    this.checkboxes.forEach(check => {
      const control = this.preChecklistForm.get(check.formControlName);
      if (control) {
        control.setValue(checked);
      }
    });
  }
}
