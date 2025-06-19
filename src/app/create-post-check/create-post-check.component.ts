import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

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
    { id: 'CheckedByJWSecurity', label: 'Checked by JW Security', formControlName: 'CheckedByJWSecurity' },
    { id: 'LicenseDiskValid', label: 'License Disk Valid', formControlName: 'LicenseDiskValid' }
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
      OilLeaks: [false],
      FuelLevel: [false],
      Mirrors: [false],
      SunVisor: [false],
      SeatBelts: [false],
      HeadLights: [false],
      Indicators: [false],
      ParkLights: [false],
      BrakeLights: [false],
      StrobeLight: [false],
      ReverseLight: [false],
      ReverseHooter: [false],
      Horn: [false],
      WindscreenWiper: [false],
      TyreCondition: [false],
      SpareWheelPresent: [false],
      JackAndWheelSpannerPresent: [false],
      Brakes: [false],
      Handbrake: [false],
      JWMarketingMagnets: [false],
      CheckedByJWSecurity: [false],
      LicenseDiskValid: [false, Validators.requiredTrue],
      Comments: [''],
      AdditionalComments: [''],
      MediaDescription: ['']
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.tripId = +params.get('tripId')!;
      if (this.tripId) {
        this.postCheckForm.patchValue({ TripId: this.tripId });

        // Fetch openingKms from backend
       this.http.get<any>(`https://localhost:7041/api/Trip/${this.tripId}/opening-kms`)

          .subscribe({
            next: (data) => {
              this.openingKms = data.openingKms;
              this.addClosingKmsValidator(); // Add validator once openingKms is received
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

  checkClosingKmsError() {
    const closingKmsControl = this.postCheckForm.get('ClosingKms');
    if (closingKmsControl?.errors) {
      this.errorMessage = closingKmsControl.errors['required']
        ? 'Closing Kms is required.'
        : closingKmsControl.errors['negativeKms']
          ? 'Closing Kms cannot be negative.'
          : closingKmsControl.errors['lessThanOpening']
            ? `Closing Kms cannot be less than Opening Kms (${this.openingKms}).`
            : null;
    } else {
      this.errorMessage = null;
    }
  }

  onFileChange(event: any) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/ogg', 'video/webm'];
    this.errorMessage = null;
    this.mediaFiles = [];

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      if (allowedTypes.includes(file.type)) {
        this.mediaFiles.push(file);
      } else {
        this.errorMessage = `Invalid file type: ${file.name}. Only images and videos are allowed.`;
        break;
      }
    }
  }

  submitForm() {
    this.validateClosingKms();
    if (this.errorMessage || this.postCheckForm.invalid) {
      this.checkClosingKmsError();
      return;
    }

    const formData = new FormData();
    for (const key of Object.keys(this.postCheckForm.value)) {
      formData.append(key, this.postCheckForm.value[key]);
    }

    if (this.mediaFiles.length > 0) {
      for (let i = 0; i < this.mediaFiles.length; i++) {
        formData.append('MediaFiles', this.mediaFiles[i], this.mediaFiles[i].name);
      }
    }

    this.http.post('https://localhost:7041/api/PostCheck/CreatePostCheck', formData).subscribe({
      next: (response) => {
        console.log('Post check created successfully', response);
        this.successMessage = 'Post check created successfully!';
        this.postCheckForm.reset();
        this.mediaFiles = [];

        setTimeout(() => {
          this.router.navigate(['/get-trip']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating post check', error);
        this.successMessage = null;
      }
    });
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

  checkAll(checked: boolean) {
    this.checkboxes.forEach(check => {
      this.postCheckForm.controls[check.formControlName].setValue(checked);
    });
  }
}
