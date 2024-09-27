import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateBookingModel } from '../../models/booking.model';
import { Vehicle } from '../../models/vehicle.model';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../user/auth.service';

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

  notificationMessage: string | null = null;
  isSuccess: boolean = true;
  minDate: string; // Add this to restrict past dates

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private authService: AuthService,
    public router: Router
  ) {
    this.bookingForm = this.fb.group({
      userName: [''],
      event: [''],
      startDate: ['', Validators.required],
      type: ['', Validators.required],
      vehicleName: ['', Validators.required],
      projectNumber: [''],
      reminderSent: [false]
    });

    // Set the minDate to today including time for datetime-local
  const today = new Date();
  // Format as YYYY-MM-DDTHH:mm (for the datetime-local input)
  this.minDate = today.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.prepopulateUserName();
    this.fetchVehicles();
    this.loadProjects();
  }

  prepopulateUserName(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.bookingForm.patchValue({ userName: profile.userName });
      },
      error: (error) => {
        console.error('Error fetching profile', error);
        this.toastr.error('Failed to load user profile', 'BookingForm');
      }
    });
  }

  fetchVehicles(): void {
    this.bookingService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles.filter(vehicle => vehicle.statusID === 1);
      },
      error: (error) => {
        console.error('Error fetching vehicles', error);
        this.toastr.error('Failed to load vehicles', 'BookingForm');
      }
    });
  }

  loadProjects(): void {
    this.projectService.getProjectNumbers().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error loading projects', error);
        this.toastr.error('Failed to load projects', 'BookingForm');
      }
    });
  }

  toggleEventProject(isEvent: boolean): void {
    this.isEvent = isEvent;
    if (isEvent) {
      this.bookingForm.get('projectNumber')?.reset();
    } else {
      this.bookingForm.get('event')?.reset();
    }
  }

  saveBooking(): void {
    if (this.bookingForm.valid) {
      const booking: CreateBookingModel = {
        userName: this.bookingForm.value.userName,
        event: this.isEvent ? this.bookingForm.value.event : null,
        startDate: this.bookingForm.value.startDate,
        vehicleName: this.bookingForm.value.vehicleName,
        projectNumber: !this.isEvent ? this.bookingForm.value.projectNumber : null,
        reminderSent: false,
        type: this.bookingForm.value.type,
      };

      this.bookingService.createBooking(booking).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          // Assume a successful creation on any 2xx status code
          this.updateVehicleStatus(this.bookingForm.value.vehicleName, 2);
          this.notificationMessage = 'Your Booking has successfully been made!';
          this.isSuccess = true;

          //Delay for notification purposes
          //this.router.navigate(['/booking-history']);
          setTimeout(() => {
            this.router.navigate(['/booking-history']);
          }, 3000); // 3 seconds delay


        },
        error: (error) => {
          console.error('Error Response:', error);
          // Check the specific status code
          if (error.status === 500) {
            this.handleError('Failed to create booking. Please try again.');
          } else {
            // Handle other error types or consider them successful
            this.notificationMessage = 'Your Booking has successfully been made, but there were some issues.';
            this.isSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/booking-history']);
            }, 3000);
            //this.router.navigate(['/booking-list']);
          }
        }
      });
    } else {
      this.handleError('Please ensure the form is valid before submitting.');
    }
  }


  handleError(message: string): void {
    this.notificationMessage = message;
    this.isSuccess = false;
  }


  updateVehicleStatus(vehicleName: string, statusId: number): void {
    this.bookingService.updateVehicleStatus(vehicleName, statusId).subscribe({
      next: () => {
        console.log(`Vehicle status updated to ${statusId}`);
      },
      error: (error) => {
        console.error('Error updating vehicle status:', error);
        this.toastr.error('Failed to update vehicle status.', 'Booking');
      }
    });
  }
}
