import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateBookingModel, BookingModel, Vehicle } from '../../models/booking.model';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css']
})
export class AddBookingComponent implements OnInit {
  bookingForm: FormGroup;
  isEvent: boolean = false;
  vehicles: Vehicle[] = [];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.bookingForm = this.fb.group({
      userName: ['', Validators.required],
      vehicleName: ['', Validators.required],
      projectNumber: ['', Validators.required],
      event: [''],
      startDate: ['', [Validators.required, this.dateValidator]],
      endDate: ['', [Validators.required, this.dateValidator]]
    }, {
      validators: this.dateComparisonValidator
    });
  }

  ngOnInit(): void {
    this.fetchVehicles();
  }

  fetchVehicles(): void {
    this.bookingService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
      },
      error: (error) => {
        console.error('Error fetching vehicles', error);
      }
    });
  }

  toggleEventProject(isEvent: boolean): void {
    this.isEvent = isEvent;
    const projectNumberControl = this.bookingForm.get('projectNumber');
    const eventControl = this.bookingForm.get('event');

    if (projectNumberControl && eventControl) {
      if (this.isEvent) {
        projectNumberControl.disable();
        eventControl.enable();
      } else {
        projectNumberControl.enable();
        eventControl.disable();
      }
    }
  }

  saveBooking(): void {
    if (this.bookingForm.valid) {
      const booking: CreateBookingModel = {
        userName: this.bookingForm.value.userName,
        event: this.bookingForm.value.event,
        startDate: this.bookingForm.value.startDate,
        endDate: this.bookingForm.value.endDate,
        vehicleName: this.bookingForm.value.vehicleName,
        projectNumber: this.bookingForm.value.projectNumber,
        reminderSent: false // Initialize as false
      };


      console.log('Booking data to be sent:', booking); // Add this line

      this.bookingService.createBooking(booking).subscribe({
        next: (response) => {
          console.log('Booking saved successfully', response);
          this.toastr.success('Your Booking has successfully been made!', 'BookingForm');
          this.router.navigate(['/booking-list']);
        },
        error: (error) => {
          console.error('Error saving booking', error);
          this.toastr.error('Failed to create booking. Please try again.', 'BookingForm');
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const date = new Date(control.value);
    if (date < new Date()) {
      return { 'invalidDate': true };
    }
    return null;
  }

  dateComparisonValidator(group: FormGroup): { [key: string]: any } | null {
    const startDate = group.get('startDate');
    const endDate = group.get('endDate');

    if (startDate && endDate && startDate.value && endDate.value) {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);

      if (end < start) {
        return { 'invalidRange': true };
      }
    }

    return null;
  }
}
