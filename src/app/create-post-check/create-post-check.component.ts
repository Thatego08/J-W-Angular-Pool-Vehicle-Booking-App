import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-post-check',
  templateUrl: './create-post-check.component.html',
  styleUrls: ['./create-post-check.component.css']
})
export class CreatePostCheckComponent implements OnInit {
  postCheckForm: FormGroup;
  mediaFiles: File[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  tripId: number | null = null; // Variable to hold the tripId

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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
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
      this.tripId = +params.get('tripId')!; // Get the tripId from the route parameters
      console.log('Trip ID:', this.tripId);
    });
  }

  validatePositiveKms(control: AbstractControl) {
    const value = control.value;
    return value !== null && value < 0 ? { negativeKms: true } : null;
  }

  checkClosingKmsError() {
    const closingKmsControl = this.postCheckForm.get('ClosingKms');
    if (closingKmsControl?.errors) {
      this.errorMessage = closingKmsControl.errors['required'] ? 'Closing Kms is required.' :
                          closingKmsControl.errors['negativeKms'] ? 'Closing Kms cannot be negative.' : null;
    } else {
      this.errorMessage = null; // No error
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
    this.checkClosingKmsError(); // Check for Closing Kms errors before submitting

    if (this.postCheckForm.invalid) {
      this.errorMessage = 'Please fix the errors in the form.';
      this.successMessage = null;
      return; // Don't submit if the form is invalid
    }

    const formData = new FormData();

    // Append tripId to formData
    if (this.tripId) {
      formData.append('TripId', this.tripId.toString());
    }

    // Append form values to formData
    Object.keys(this.postCheckForm.value).forEach(key => {
      formData.append(key, this.postCheckForm.value[key]);
    });

    // Append media files to formData
    this.mediaFiles.forEach(file => {
      formData.append('MediaFiles', file, file.name);
    });

    // Send the POST request to create a post check
    this.http.post('https://localhost:7041/api/PostCheck/CreatePostCheck', formData).subscribe({
      next: (response) => {
        console.log('Post check created successfully', response);
        this.successMessage = 'Post check submitted successfully!';
        this.errorMessage = null;

        // Reset the form and media files
        this.postCheckForm.reset();
        this.mediaFiles = [];
      },
      error: (error) => {
        console.error('Error creating post check', error);
        this.successMessage = null;
        this.errorMessage = 'There was an error submitting the post check.';
      }
    });
  }

  checkAll(checked: boolean) {
    this.checkboxes.forEach(check => {
      this.postCheckForm.controls[check.formControlName].setValue(checked);
    });
  }
}
