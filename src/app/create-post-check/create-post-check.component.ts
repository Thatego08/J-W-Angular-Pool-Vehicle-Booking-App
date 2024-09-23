import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      ClosingKms: [null, Validators.required],
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
      LicenseDiskValid: [false],
      Comments: [''],
      AdditionalComments: [''],
      MediaDescription: ['']
    });
  }

  onFileChange(event: any) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/ogg', 'video/webm'];
    this.errorMessage = null; // Reset error message
    this.mediaFiles = []; // Reset mediaFiles array
  
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
  
      if (allowedTypes.includes(file.type)) {
        this.mediaFiles.push(file);
      } else {
        this.errorMessage = `Invalid file type: ${file.name}. Only images and videos are allowed.`;
        break; // Stop processing if an invalid file is found
      }
    }
  }
  
  submitForm() {
    if (this.errorMessage) {
      // Don't submit if there's an error
      return;
    }

    const formData = new FormData();

    // Append all form fields
    for (const key of Object.keys(this.postCheckForm.value)) {
      formData.append(key, this.postCheckForm.value[key]);
    }

    // Append media files if any
    if (this.mediaFiles.length > 0) {
      for (let i = 0; i < this.mediaFiles.length; i++) {
        formData.append('MediaFiles', this.mediaFiles[i], this.mediaFiles[i].name);
      }
    }


    // Make the API call
  this.http.post('https://localhost:7041/api/PostCheck/CreatePostCheck', formData).subscribe({
    next: (response) => {
      console.log('Post check created successfully', response);
      this.successMessage = 'Post check created successfully!';
      
      // Optionally, you can reset the form and mediaFiles here if needed
      this.postCheckForm.reset();
      this.mediaFiles = [];

      // Redirect to the get-trip page after 2 seconds
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
  checkAll(checked: boolean) {
    this.checkboxes.forEach(check => {
      this.postCheckForm.controls[check.formControlName].setValue(checked);
    });
  }
}
