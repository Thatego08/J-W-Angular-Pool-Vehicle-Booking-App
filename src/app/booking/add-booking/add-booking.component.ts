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

  // New properties
  
filteredVehicles: Vehicle[] = [];
selectedDriveType: string = 'All';
selectedTransmission: string = 'All';
hasTowBar: boolean = false;
hasCanopy: boolean = false;
selectedCompliance: string = 'All';
selectedProtection: string = 'All';
complianceOptions: string[] = ['All', 'Sasol Sasolburg','Private use', 'Sasol Secunda','Venetia','Sishen','Medupi'];
protectionOptions: string[] = ['All','ROPS'];

//Additions 
// Update your fetchAvailableVehicles method
// fetchAvailableVehicles(startDate: Date, endDate: Date): void {
//   this.bookingService.getAvailableVehicles(startDate, endDate).subscribe({
//     next: (vehicles) => {
//       this.vehicles = vehicles;
//       this.filteredVehicles = this.applyAllFilters(vehicles);
//     },
//     error: (error) => {
//       console.error('Error fetching available vehicles', error);
//       this.toastr.error('Failed to fetch available vehicles.');
//     }
//   });
// }
fetchAvailableVehicles(startDate: Date, endDate: Date): void {
  console.log('Fetching vehicles for:', startDate, 'to', endDate);
  
  this.bookingService.getAvailableVehicles(startDate, endDate).subscribe({
    next: (vehicles) => {
      console.log('Raw API Response:', vehicles);

       // Generate compliance options - include empty as "None"
      const allCompliance = vehicles.map(v => v.compliance || 'None');
      this.complianceOptions = ['All', ...new Set(allCompliance)];
      
      // Generate protection options - include empty as "None"
      const allProtection = vehicles.map(v => v.protection || 'None');
      this.protectionOptions = ['All', ...new Set(allProtection)];
      
      console.log('Compliance Options:', this.complianceOptions);
      console.log('Protection Options:', this.protectionOptions);
      
      vehicles = vehicles.map(v => ({
        ...v,
        hasTowBar: v.hasTowBar === true || 
                   (typeof v.hasTowBar === 'string' && (v.hasTowBar as string).toLowerCase().includes('tow')),
        hasCanopy: v.hasCanopy === true || 
                   (typeof v.hasCanopy === 'string' && (v.hasCanopy as string).toLowerCase().includes('canopy')),
        
      }));

      // Log each vehicle's details
      vehicles.forEach(v => {
        console.log(
          `Vehicle: ${v.name} | ` +
          `Cabin: ${v.cabinType} | Drive: ${v.driveType} | ` +
          `Trans: ${v.transmission} | Tow: ${v.hasTowBar} | Canopy: ${v.hasCanopy}`+
          ` Compliance: "${v.compliance}", Protection: "${v.protection}"`
        );
      });
      
      


      this.filteredVehicles = this.applyAllFilters(vehicles);
      console.log('Filtered Vehicles:', this.filteredVehicles);
    },
    error: (error) => {
      console.error('Error fetching available vehicles', error);
      this.toastr.error('Failed to fetch available vehicles.');
    }

    
  });
}
// Combined filter method
applyAllFilters(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.filter(vehicle => {
    // Cabin Type filter
      const typeMatch = this.selectedVehicleType === 'All' || 
      (this.selectedVehicleType === 'Double Cab' && vehicle.cabinType === 'Double') ||
      (this.selectedVehicleType === 'Single Cab' && vehicle.cabinType === 'Single') ||

            (this.selectedVehicleType === 'SUV' && vehicle.cabinType === 'SUV') ||
      (this.selectedVehicleType === 'Extra Cab' && vehicle.cabinType === 'Extra');


    // Drive Type filter
    const driveMatch = this.selectedDriveType === 'All' || 
      vehicle.driveType == (this.selectedDriveType);

    // Transmission filter
    const transmissionMatch = this.selectedTransmission === 'All' ||
      vehicle.transmission === this.selectedTransmission;

    // Features filter
    const towBarMatch = !this.hasTowBar || vehicle.description.includes('Tow bar')|| vehicle.hasTowBar;
    const canopyMatch = !this.hasCanopy || vehicle.description.includes('Canopy') || vehicle.hasCanopy;

     // Compliance filter (handle "None")
    const vehicleCompliance = vehicle.compliance || 'None';
    const complianceMatch = this.selectedCompliance === 'All' || 
                           vehicleCompliance === this.selectedCompliance;
    
    // Protection filter (handle "None")
    const vehicleProtection = vehicle.protection || 'None';
    const protectionMatch = this.selectedProtection === 'All' || 
                           vehicleProtection === this.selectedProtection;

    return typeMatch && driveMatch && transmissionMatch &&  towBarMatch && canopyMatch && complianceMatch && protectionMatch;
  });
}
  loadingVehicles: boolean = false;
// Update all filters when any change occurs

onComplianceChange(): void {
  this.updateFilters();
}

onProtectionChange(): void {
  this.updateFilters();
}
updateFilters(): void {
  this.filteredVehicles = this.applyAllFilters(this.vehicles);
}

// Modify your existing filter method
myfilterVehiclesByType(vehicles: Vehicle[]): Vehicle[] {
  // This is now handled in applyAllFilters
  return vehicles;
}



  vehicleTypes: string[] = ['All', 'Double Cab', 'Single Cab', 'Extra Cab', 'SUV'];
  selectedVehicleType: string = 'All';

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
      endDate: ['', Validators.required],
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
      this.fetchVehicles(); // Can fetch initially for any vehicles if needed
      this.loadProjects();
      
      // // Listen to form control changes
      // this.bookingForm.get('startDate')?.valueChanges.subscribe(() => this.onStartDateEndDateChange());
      // this.bookingForm.get('endDate')?.valueChanges.subscribe(() => this.onStartDateEndDateChange());
   this.bookingForm.get('startDate')?.valueChanges.subscribe(() => this.onStartDateEndDateChange());
    this.bookingForm.get('endDate')?.valueChanges.subscribe(() => this.onStartDateEndDateChange());

      
    }
onStartDateEndDateChange(): void {
    const startDateString = this.bookingForm.value.startDate;
    const endDateString = this.bookingForm.value.endDate;
  
    if (startDateString && endDateString) {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
  
      // Ensure valid date conversion
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        this.loadingVehicles = true;
        this.fetchAvailableVehicles(startDate, endDate);
      } else {
        console.error('Invalid date provided');
        this.toastr.error('Invalid date provided', 'BookingForm');
        this.filteredVehicles = [];
      }
    } else {
      this.filteredVehicles = [];
    }
  }
//  fetchAvailableVehicles(startDate: Date, endDate: Date): void {
//     this.bookingService.getAvailableVehicles(startDate, endDate).subscribe({
//       next: (vehicles) => {
//         // Process and filter vehicles
//         this.vehicles = vehicles.map(v => ({
//           ...v,
//           hasTowBar: v.hasTowBar === true || 
//                      (typeof v.hasTowBar === 'string' && (v.hasTowBar as string).toLowerCase().includes('tow')),
//           hasCanopy: v.hasCanopy === true || 
//                      (typeof v.hasCanopy === 'string' && (v.hasCanopy as string).toLowerCase().includes('canopy')),
//         }));

//         // Generate filter options
//         const allCompliance = vehicles.map(v => v.compliance || 'None');
//         this.complianceOptions = ['All', ...new Set(allCompliance)];
        
//         const allProtection = vehicles.map(v => v.protection || 'None');
//         this.protectionOptions = ['All', ...new Set(allProtection)];
        
//         // Apply initial filters
//         this.filteredVehicles = this.applyAllFilters(vehicles);
//         this.loadingVehicles = false;
//       },
//       error: (error) => {
//         console.error('Error fetching available vehicles', error);
//         this.toastr.error('Failed to fetch available vehicles.');
//         this.filteredVehicles = [];
//         this.loadingVehicles = false;
//       }
//     });
//   }
//     // Add to your component class
// onDriveTypeChange(): void {
//   this.updateFilters();
// }



onTransmissionChange(): void {
  this.updateFilters();
}

onFeaturesChange(): void {
  this.updateFilters();
}

    // fetchAvailableVehicles(startDate: Date, endDate: Date): void {
    //   this.bookingService.getAvailableVehicles(startDate, endDate).subscribe({
    //     next: (vehicles) => {
    //       this.vehicles = vehicles; // Update vehicles list
    //   this.vehicles = this.filterVehiclesByType(vehicles); // Apply initial filter
    //     },
    //     error: (error) => {
    //       console.error('Error fetching available vehicles', error);
    //       this.toastr.error('Failed to fetch available vehicles.');
    //     }
    //   });
    // }

// Add this method to handle vehicle type changes
// onVehicleTypeChange(): void {
//   const startDate = this.bookingForm.value.startDate;
//   const endDate = this.bookingForm.value.endDate;
  
//   if (startDate && endDate) {
//     this.fetchAvailableVehicles(new Date(startDate), new Date(endDate));
//   }
// }

// Add this to handle vehicle type changes
onVehicleTypeChange(): void {
  //this.vehicles = this.filterVehiclesByType(this.vehicles);
  this.updateFilters(); // Update filtered vehicles based on the new type
}


    // onStartDateEndDateChange(): void {
    //   const startDateString = this.bookingForm.value.startDate;
    //   const endDateString = this.bookingForm.value.endDate;
    
    //   if (startDateString && endDateString) {
    //     const startDate = new Date(startDateString); // Convert to Date object
    //     const endDate = new Date(endDateString);
    
    //     // Ensure valid date conversion
    //     if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
    //       this.fetchAvailableVehicles(startDate, endDate);
    //     } else {
    //       console.error('Invalid date provided');
    //       this.toastr.error('Invalid date provided', 'BookingForm');
    //     }
    //   }
    // }
    
  

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
      const startDateString = this.bookingForm.value.startDate;
      const endDateString = this.bookingForm.value.endDate;
  
      const startDate = new Date(startDateString); // Convert to Date object
      const endDate = new Date(endDateString);
  
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        this.handleError('Please provide valid start and end dates.');
        return;
      }
  
      const booking: CreateBookingModel = {
        userName: this.bookingForm.value.userName,
        event: this.isEvent ? this.bookingForm.value.event : null,
        startDate: startDate.toISOString(),  // Convert to ISO string
        endDate: endDate.toISOString(),      // Convert to ISO string
        vehicleName: this.bookingForm.value.vehicleName,
        projectNumber: !this.isEvent ? this.bookingForm.value.projectNumber : null,
        reminderSent: false,
        type: this.bookingForm.value.type,
      };

      this.bookingService.createBooking(booking).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          //this.updateVehicleStatus(this.bookingForm.value.vehicleName, 2);
          this.notificationMessage = 'Your Booking has successfully been made!';
          this.isSuccess = true;
  
          setTimeout(() => {
            this.router.navigate(['/booking-history']);
          }, 3000); // Delay for 3 seconds
  
        },
        error: (error) => {
          console.error('Error Response:', error);
          if (error.status === 500) {
            this.handleError('Failed to create booking. Please try again.');
          } 
          
          else {
            this.notificationMessage = 'Your Booking has successfully been made, but there were some issues.';
            this.isSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/booking-history']);
            }, 3000);
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
