import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-create-post-check',
  templateUrl: './create-post-check.component.html',
  styleUrls: ['./create-post-check.component.css']
})
export class CreatePostCheckComponent {
  postCheckForm: FormGroup;
  mediaFiles: File[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  tripId: number | null = null;
  openingKms: number | null = null;
  mediaPreviews: { file: File, previewUrl: string, type: string }[] = [];

  checkboxes = [
    { id: 'OilLeaks', label: 'Oil Leaks', formControlName: 'OilLeaks' },
    { id: 'FuelLevel', label: 'Fuel Level', formControlName: 'FuelLevel' },
    { id: 'Mirrors', label: 'Mirrors', formControlName: 'Mirrors' },
    { id: 'SunVisor', label: 'Sun Visor', formControlName: 'SunVisor' },
    { id: 'SeatBelts', label: 'Seat Belts', formControlName: 'SeatBelts' },
    { id: 'HeadLights', label: 'Head Lights', formControlName: 'HeadLights' },
    { id: 'Indicators', label: 'Indicators', formControlName: 'Indicators' },
    { id: 'ParkLights', label: 'Park Lights', formControlName: 'ParkLights' },
    { id: 'BrakeLights', label: 'Brake Lights', formControlName: 'BrakeLights' },
    { id: 'StrobeLight', label: 'Strobe Light', formControlName: 'StrobeLight' },
    { id: 'ReverseLight', label: 'Reverse Light', formControlName: 'ReverseLight' },
    { id: 'ReverseHooter', label: 'Reverse Hooter', formControlName: 'ReverseHooter' },
    { id: 'Horn', label: 'Horn', formControlName: 'Horn' },
    { id: 'WindscreenWiper', label: 'Windscreen Wiper', formControlName: 'WindscreenWiper' },
    { id: 'TyreCondition', label: 'Tyre Condition', formControlName: 'TyreCondition' },
    { id: 'SpareWheelPresent', label: 'Spare Wheel Present', formControlName: 'SpareWheelPresent' },
    { id: 'JackAndWheelSpannerPresent', label: 'Jack and Wheel Spanner Present', formControlName: 'JackAndWheelSpannerPresent' },
    { id: 'Brakes', label: 'Brakes', formControlName: 'Brakes' },
    { id: 'Handbrake', label: 'Handbrake', formControlName: 'Handbrake' },
    { id: 'JWMarketingMagnets', label: 'JW Marketing Magnets', formControlName: 'JWMarketingMagnets' },
    { id: 'CheckedByJWSecurity', label: 'Checked by JW Security', formControlName: 'CheckedByJWSecurity' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postCheckForm = this.fb.group({
      TripId: [null],
      ClosingKms: [null, [Validators.required, this.validatePositiveKms]],
      TravelEnd: [null], // NEW field
      Comments: [''],
      AdditionalComments: [''],
      MediaDescription: [''],
      LicenseDiskValid: [false, Validators.requiredTrue],
    });

    this.checkboxes.forEach(check => {
      this.postCheckForm.addControl(check.formControlName, this.fb.control('', Validators.required));
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.tripId = +params.get('tripId')!;
      if (this.tripId) {
        this.postCheckForm.patchValue({ TripId: this.tripId });

       this.http.get<any>(`${environment.apiUrl}/Trip/${this.tripId}/opening-kms`)

          .subscribe({
            next: (data) => {
              this.openingKms = data.openingKms;
              this.addClosingKmsValidator();
            },
            error: (err) => {
              console.error('Failed to load opening Kms', err);
              this.errorMessage = 'Could not load opening KMs for validation.';
            }
          });
      }
    });
  }

  validatePositiveKms(control: AbstractControl) {
    const value = control.value;
    return value !== null && value < 0 ? { negativeKms: true } : null;
  }

  addClosingKmsValidator() {
    const closingKmsControl = this.postCheckForm.get('ClosingKms');
    closingKmsControl?.addValidators((control: AbstractControl) => {
      const closing = control.value;
      if (this.openingKms !== null && closing < this.openingKms) {
        return { lessThanOpening: true };
      }
      return null;
    });
    closingKmsControl?.updateValueAndValidity();
  }

  validateClosingKms() {
    const closingKms = this.postCheckForm.get('ClosingKms')?.value;
    if (this.openingKms !== null && closingKms !== null && closingKms < this.openingKms) {
      this.postCheckForm.get('ClosingKms')?.setErrors({ lessThanOpening: true });
    } else {
      const errors = this.postCheckForm.get('ClosingKms')?.errors;
      if (errors) {
        delete errors['lessThanOpening'];
        if (Object.keys(errors).length === 0) {
          this.postCheckForm.get('ClosingKms')?.setErrors(null);
        } else {
          this.postCheckForm.get('ClosingKms')?.setErrors(errors);
        }
      }
    }
  }

  checkAll(setToCompliant: boolean) {
    const value = setToCompliant ? 'compliant' : '';
    this.checkboxes.forEach(check => {
      this.postCheckForm.controls[check.formControlName].setValue(value);
    });
  }

  onFileChange(event: any) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/ogg', 'video/webm'];
    this.errorMessage = null;
    this.mediaFiles = [];
    this.mediaPreviews = [];

    for (let file of event.target.files) {
      if (allowedTypes.includes(file.type)) {
        this.mediaFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const type = file.type.startsWith('image') ? 'image' : 'video';
          this.mediaPreviews.push({ file, previewUrl: e.target.result, type });
        };
        reader.readAsDataURL(file);
      } else {
        this.errorMessage = `Invalid file type: ${file.name}`;
      }
    }
  }

  submitForm() {
  this.validateClosingKms();

  if (this.postCheckForm.invalid) {
    return;
  }

  // Create FormData for submission
  const formData = new FormData();

  // Append all form fields from the form
  for (const key of Object.keys(this.postCheckForm.value)) {
    const value = this.postCheckForm.value[key];
    // Convert Date objects to ISO string if needed (for TravelEnd)
    formData.append(key, value instanceof Date ? value.toISOString() : value);
  }

  // Append media files
  this.mediaFiles.forEach(file => {
    formData.append('MediaFiles', file, file.name);
  });

  // Send POST request to backend
  this.http.post(`${environment.apiUrl}/PostCheck/CreatePostCheck`, formData)
    .subscribe({
      next: () => {
        this.successMessage = 'Post check created successfully!';
        this.postCheckForm.reset();
        this.mediaFiles = [];
        this.mediaPreviews = [];

        // Original navigation back to /get-trip
        setTimeout(() => this.router.navigate(['/get-trip']), 2000);
      },
      error: (error) => {
        console.error('Error creating post check', error);
        this.successMessage = null;
      }
    });

  // Original duplicate navigation
  setTimeout(() => {
    this.router.navigate(['/app-trip']);
  }, 2000);
}
}