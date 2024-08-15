import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {

  tripForm: FormGroup;
  message: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  fileError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private tripService: TripService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tripForm = this.formBuilder.group({
      vehicleName: [''], // Vehicle Name
      location: ['', Validators.required],
      comment: [''],
      travelStart: [null, Validators.required],
      travelEnd: [null, Validators.required],
      mediaFiles: [null], // Adjust to handle file list
      mediaDescription: [''],
      bookingID: [null, Validators.required] // Add BookingID to form
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['bookingId']) {
        const startDate = params['startDate'];
        const endDate = params['endDate'];
        const vehicleName = params['vehicleName'];
        const bookingId = +params['bookingId']; // Parse BookingID

        this.tripForm.patchValue({
          vehicleName: vehicleName || '',
          travelStart: startDate ? this.formatDateTime(startDate) : null,
          travelEnd: endDate ? this.formatDateTime(endDate) : null,
          bookingID: bookingId // Set BookingID in form
        });
      }
    });
  }

  formatDateTime(dateTime: string): string {
    return dateTime.slice(0, 16); // Adjust format for datetime-local input
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const formData = new FormData();
      formData.append('Name', this.tripForm.value.vehicleName);
      formData.append('Location', this.tripForm.value.location);
      formData.append('Comment', this.tripForm.value.comment);
      formData.append('TravelStart', this.tripForm.value.travelStart);
      formData.append('TravelEnd', this.tripForm.value.travelEnd);
      formData.append('BookingID', this.tripForm.value.bookingID); // Append BookingID

      if (this.tripForm.value.mediaFiles) {
        const files: FileList = this.tripForm.value.mediaFiles;
        for (let i = 0; i < files.length; i++) {
          formData.append('MediaFiles', files[i]);
        }
      }

      formData.append('MediaDescription', this.tripForm.value.mediaDescription);

      this.tripService.createTrip(formData).subscribe(
        response => {
          // Trigger a success alert
          alert('Trip has been successfully created');
          this.tripForm.reset();
          this.imagePreview = null;
          this.router.navigate(['/trips']);
        },
        error => {
          this.message = 'Failed to create trip';
        }
      );
    }
  }

  cancelImage() {
    this.tripForm.patchValue({
      mediaFiles: null
    });
    this.imagePreview = null;
  }

  onFileChange(event: any): void {
    const files: FileList | null = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileType = file.type;

      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
        this.fileError = null;
        this.tripForm.patchValue({
          mediaFiles: files
        });
      } else {
        this.fileError = 'Please upload a valid image file (e.g., JPG, PNG).';
        this.imagePreview = null;
        this.tripForm.patchValue({
          mediaFiles: null
        });
      }
    }
  }
}
