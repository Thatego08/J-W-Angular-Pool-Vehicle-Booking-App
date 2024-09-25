import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.postCheckForm = this.fb.group({
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
      LicenseDiskValid: [false, Validators.requiredTrue], // Ensure LicenseDiskValid is checked
      Comments: [''],
      AdditionalComments: [''],
      MediaDescription: [''] // Make MediaDescription optional
    });
  }

  // Custom validator for ClosingKms to check if it's positive
  validatePositiveKms(control: AbstractControl) {
    const value = control.value;
    if (value !== null && value < 0) {
      return { negativeKms: true }; // Return error key if value is negative
    }
    return null; // Return null if there's no error
  }

  // Method to check for Closing Kms errors and display message
  checkClosingKmsError() {
    const closingKmsControl = this.postCheckForm.get('ClosingKms');
    if (closingKmsControl?.errors) {
      if (closingKmsControl.errors['required']) {
        this.errorMessage = 'Closing Kms is required.';
      } else if (closingKmsControl.errors['negativeKms']) {
        this.errorMessage = 'Closing Kms cannot be negative.';
      }
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
      this.errorMessage = 'Please fix the errors in the form.'; // Show error message if the form is invalid
      this.successMessage = null; // Clear success message
      return; // Don't submit if the form is invalid
    }

    const formData = new FormData();

    // Append form values to formData
    for (const key of Object.keys(this.postCheckForm.value)) {
      formData.append(key, this.postCheckForm.value[key]);
    }

    // Append media files to formData if any exist
    if (this.mediaFiles.length > 0) {
      for (let i = 0; i < this.mediaFiles.length; i++) {
        formData.append('MediaFiles', this.mediaFiles[i], this.mediaFiles[i].name);
      }
    }

    // Send the POST request to create a post check
    this.http.post('https://localhost:7041/api/PostCheck/CreatePostCheck', formData).subscribe({
      next: (response) => {
        console.log('Post check created successfully', response);
        this.successMessage = 'Post check submitted successfully!'; // Set success message
        this.errorMessage = null; // Clear any existing error message
        
        // Reset the form and media files
        this.postCheckForm.reset();
        this.mediaFiles = [];
      },
      error: (error) => {
        console.error('Error creating post check', error);
        this.successMessage = null; // Clear success message on error
        this.errorMessage = 'There was an error submitting the post check.'; // Set error message
      }
    });
  }

  checkAll(checked: boolean) {
    this.checkboxes.forEach(check => {
      this.postCheckForm.controls[check.formControlName].setValue(checked);
    });
  }
}
