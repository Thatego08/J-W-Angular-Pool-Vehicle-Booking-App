import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../services/trip.service';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {
  tripForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tripForm = this.fb.group({
      vehicleName: [''],
      location: ['', Validators.required],
      comment: [''],
      travelStart: ['', Validators.required],
      travelEnd: [''],
      bookingID: [''],
      checklistId: [''],
      mediaFiles: [''],
      mediaDescription: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const preChecklistId = params['preChecklistId'];
      const bookingId = params['bookingId'];
  
      if (preChecklistId) {
        this.tripForm.patchValue({ checklistId: preChecklistId });
      }
      if (bookingId) {
        this.tripForm.patchValue({ bookingID: bookingId });
        this.fetchBookingDetails(bookingId); // Fetch booking details if needed
      }
    });
  }
  

  fetchBookingDetails(bookingId: number): void {
    // Fetch booking details if necessary
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const formData = new FormData();
      formData.append('Name', this.tripForm.value.vehicleName || '');
      formData.append('Location', this.tripForm.value.location || '');
      formData.append('Comment', this.tripForm.value.comment || '');
      formData.append('TravelStart', this.tripForm.value.travelStart || '');
      formData.append('TravelEnd', this.tripForm.value.travelEnd || '');
      formData.append('BookingID', this.tripForm.value.bookingID || '');
      formData.append('PreChecklistId', this.tripForm.value.checklistId || '');

      if (this.tripForm.value.mediaFiles) {
        const files: FileList = this.tripForm.value.mediaFiles;
        for (let i = 0; i < files.length; i++) {
          formData.append('MediaFiles', files[i]);
        }
      }

      formData.append('MediaDescription', this.tripForm.value.mediaDescription || '');

      this.tripService.createTrip(formData).subscribe(
        response => {
          alert('Trip has been successfully created');
          this.tripForm.reset();
          this.imagePreview = null;
          this.router.navigate(['/create-trip']);
        },
        error => {
          this.message = 'Failed to create trip';
        }
      );
    }
  }
}
