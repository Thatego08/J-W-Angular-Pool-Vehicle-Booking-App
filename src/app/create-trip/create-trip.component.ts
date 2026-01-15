import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../services/trip.service';
import { BookingService } from '../services/booking.service';
import { PreChecklistService } from '../pre-checklist.service';
import { PreCheckList } from '../pre-check-list';
import { BookingModel } from '../models/booking.model';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {
  tripForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  message: string | null = null;
  minDate: string;  //This one
  

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private bookingService: BookingService,
    private preChecklistService: PreChecklistService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tripForm = this.fb.group({
      vehicleName: [''],
      location: ['', Validators.required],
      comment: [''],
      travelStart: ['', Validators.required],
      //travelEnd: [''],
      bookingID: [''],
      checklistId: [0],
      mediaFiles: [''],
      mediaDescription: [''],
      
    });

     // Set the minDate to today
     const today = new Date();
     this.minDate = today.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
  }

  ngOnInit(): void {
    const preChecklistId = this.route.snapshot.queryParamMap.get('preChecklistId');
    if (preChecklistId) {
      this.tripForm.patchValue({ checklistId: +preChecklistId });
      this.fetchPreChecklistDetails(+preChecklistId);
    }
  
    const bookingId = this.route.snapshot.queryParamMap.get('bookingId');
    if (bookingId) {
      this.tripForm.patchValue({ bookingID: +bookingId }); // Convert to number
      this.fetchBookingDetails(+bookingId);
    }
  }
  
  fetchBookingDetails(bookingId: number): void {
    this.bookingService.getBooking(bookingId).subscribe(
      (booking: BookingModel) => {
        this.tripForm.patchValue({
          vehicleName: booking.vehicleName, // This should work correctly
          travelStart: booking.startDate // Pre-populate travelStart with startDate
        });
      },
      error => {
        console.error('Failed to fetch Booking details', error);
      }
    );
  }
  
  fetchPreChecklistDetails(preChecklistId: number): void {
    this.preChecklistService.getPreChecklist(preChecklistId).subscribe(
      (data: PreCheckList) => {
        console.log(data);
      },
      error => {
        console.error('Failed to fetch PreChecklist details', error);
      }
    );
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const formData = new FormData();
      formData.append('Name', this.tripForm.value.vehicleName || '');
      formData.append('Location', this.tripForm.value.location || '');
      formData.append('Comment', this.tripForm.value.comment || '');
      formData.append('TravelStart', this.tripForm.value.travelStart || '');
     // formData.append('TravelEnd', this.tripForm.value.travelEnd || '');
      formData.append('BookingID', this.tripForm.value.bookingID || '');
      formData.append('PreChecklistId', this.tripForm.value.checklistId || '');

      // Append media files if any
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
          localStorage.removeItem('currentBookingId'); // Clear if desired
          this.router.navigate(['/get-trip']);
        },
        error => {
          this.message = 'Failed to create trip';
          console.error(error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
