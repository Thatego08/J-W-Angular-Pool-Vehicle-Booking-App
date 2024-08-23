import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-post-check',
  templateUrl: './create-post-check.component.html',
  styleUrls: ['./create-post-check.component.css']
})
export class CreatePostCheckComponent {
  postCheckForm: FormGroup;
  mediaFiles: File[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
    if (event.target.files.length > 0) {
      this.mediaFiles = event.target.files;
    }
  }

  submitForm() {
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
      },
      error: (error) => {
        console.error('Error creating post check', error);
      }
    });
  }
}
