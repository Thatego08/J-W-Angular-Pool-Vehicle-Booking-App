import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingModel } from '../../models/booking.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css']
})
export class EditBookingComponent implements OnInit {
  @Input() booking: BookingModel | null = null;
  @Output() close = new EventEmitter<void>();
  bookingForm: FormGroup;
  isEvent: boolean = false;

  // Define arrays for vehicles and projects
  vehicles: string[] = [
    'Hyundai 1', 'Toyota 1', 'Toyota 2', 'Toyota 3', 'Toyota 4', 'Toyota 5',
    'Toyota 6', 'Toyota 7', 'Toyota 8', 'Toyota 9', 'Toyota 10', 'Toyota 11',
    'Toyota 12', 'Toyota 13', 'Toyota 14', 'Toyota 15', 'Toyota S1', 'Toyota S2', 'Toyota S3', 'Isuzu 1'
  ];

  // Updated projects array with numeric values
  projects: { number: number, name: string }[] = [
    { number: 120, name: 'Project 1' },
    { number: 128, name: 'Project 2' },
    { number: 129, name: 'Project 3' },
    { number: 130, name: 'Project 4' },
    { number: 131, name: 'Project 5' }
  ];
  minDate: string; // Add this to restrict past dates

  constructor(
    private bookingService: BookingService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.bookingForm = this.fb.group({
      userName: ['', Validators.required],
      vehicleName: ['', Validators.required],
      projectNumber: [''],
      event: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      rateType: ['Half Day Rate'],
      reminderSent: [false]
    });

    // Set the minDate to today including time for datetime-local
  const today = new Date();
  // Format as YYYY-MM-DDTHH:mm (for the datetime-local input)
  this.minDate = today.toISOString().slice(0, 16);

  }

  ngOnInit(): void {
    if (this.booking) {
      this.bookingForm.patchValue({
        ...this.booking,
        reminderSent: false
      });

      this.isEvent = !!this.booking.event;
      this.toggleEventProject(this.isEvent);
    }
  }

  toggleEventProject(isEvent: boolean): void {
    this.isEvent = isEvent;
    const projectNumberControl = this.bookingForm.get('projectNumber');
    const eventControl = this.bookingForm.get('event');

    if (projectNumberControl && eventControl) {
      if (this.isEvent) {
        projectNumberControl.clearValidators();
        eventControl.setValidators([Validators.required]);
      } else {
        eventControl.clearValidators();
        projectNumberControl.setValidators([Validators.required]);
      }
      projectNumberControl.updateValueAndValidity();
      eventControl.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.booking) {
      const updatedBooking: BookingModel = {
        ...this.bookingForm.value,
        bookingID: this.booking.bookingID
      };

      this.bookingService.updateBooking(updatedBooking).subscribe(
        (response) => {
          this.activeModal.close();
          alert('Booking has been successfully updated!');
        },
        (error) => {
          console.error('Error updating booking:', error);
          alert('There was an error updating the booking. Please try again.');
        }
      );
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
