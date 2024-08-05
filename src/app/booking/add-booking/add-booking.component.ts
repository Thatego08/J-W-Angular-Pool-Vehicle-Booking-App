import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateBookingModel, BookingModel, Vehicle } from '../../models/booking.model';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/Project';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css']
})
export class AddBookingComponent implements OnInit {
  bookingForm: FormGroup;
  isEvent: boolean = false;
  vehicles: Vehicle[] = [];
  projects: number[] = [];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private projectService: ProjectService,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.bookingForm = this.fb.group({
      userName: ['', Validators.required],
      event: [''],
      startDate: ['', [Validators.required, this.dateValidator]],
      type: ['', Validators.required],
      endDate: ['', [Validators.required, this.dateValidator]],
      vehicleName: ['', Validators.required],
      projectNumber: [''],
      reminderSent: [false]
    }, { validators: this.dateComparisonValidator });
  }

  ngOnInit(): void {
    this.fetchVehicles();
    this.loadProjects();    
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

  loadProjects(): void {
    this.projectService.getProjectNumbers().subscribe(
      (projects) => {
        this.projects = projects;
      },
      (error) => {
        console.error('Error loading projects', error);
      }
    );
  }
  btoggleEventProject(isEvent: boolean): void {
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
        event: this.isEvent ? this.bookingForm.value.event : null, 
        startDate: this.bookingForm.value.startDate,
        type: this.bookingForm.value.type,
        endDate: this.bookingForm.value.endDate,
        vehicleName: this.bookingForm.value.vehicleName,
        statusId: 2,//Initialize as booked
        projectNumber:!this.isEvent ?  this.bookingForm.value.projectNumber: null,
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

  //Event/Project additions
  toggleEventProject(isEvent: boolean): void {
    this.isEvent = isEvent;
    if (isEvent) {
      this.bookingForm.get('projectNumber')?.reset();
    } else {
      this.bookingForm.get('event')?.reset();
    }
  }
}
