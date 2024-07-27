import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingModel } from '../../models/booking.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css']
})
export class EditBookingComponent implements OnInit{
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

  projects: string[] = [
    'Construction Project', 'Mining Project', 'Bridge Building Project',
    'City Infrastructure Project', 'Impact Analysis Project'
  ];

  constructor(
    private bookingService: BookingService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.bookingForm = this.fb.group({
      userName: ['', Validators.required],
      vehicleName: ['', Validators.required],
      projectName: [''],
      event: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      rateType: ['Half Day Rate'],
      reminderSent: [false]
    });
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
    const projectNameControl = this.bookingForm.get('projectName');
    const eventControl = this.bookingForm.get('event');

    if (projectNameControl && eventControl) {
      if (this.isEvent) {
        projectNameControl.clearValidators();
        eventControl.setValidators([Validators.required]);
      } else {
        eventControl.clearValidators();
        projectNameControl.setValidators([Validators.required]);
      }
      projectNameControl.updateValueAndValidity();
      eventControl.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.booking) {
      const updatedBooking: BookingModel = {
        ...this.bookingForm.value,
        bookingID: this.booking.bookingID
      };

      this.bookingService.updateBooking(updatedBooking).subscribe(() => {
        this.activeModal.close();
        alert('Booking has been successfully updated!');
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
