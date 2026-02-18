import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { AuthService } from '../../user/auth.service';// import AuthService
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  
  service: Service = {
    vehicleID: 0,
    adminName: '',
    adminEmail: '',
    startDate: new Date(),
    endDate: new Date(),
    description: '',
  };

  vehicles: Vehicle[] = [];
  services: Service[] = [];
  displayServices: any[] = [];
  message: string = '';
  serviceId!: number;

  constructor(
    private serviceService: ServiceService,
    private vehicleService: VehicleService,
    private authService: AuthService,          // injected
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Load vehicles first, then services (for the table)
    this.vehicleService.getAllVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
      this.loadAllServices();
    });

    // Determine if we are in edit or create mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Edit mode – load the existing service (you'll need to implement this)
        this.serviceId = +id;
        this.loadServiceForEdit(this.serviceId);  // placeholder – you'll need to create this method
      } else {
        // Create mode – auto‑populate admin fields from logged‑in user
        this.loadCurrentUser();
      }
    });
  }

  // Load all services for the table
  loadAllServices(): void {
    this.serviceService.getAllServices().subscribe(services => {
      this.services = services;
      this.displayServices = services.map(s => {
        const vehicle = this.vehicles.find(v => v.vehicleID === s.vehicleID);
        return {
          ...s,
          vehicleDisplay: vehicle ? `${vehicle.name} - ${vehicle.registrationNumber}` : 'Unknown'
        };
      });
    });
  }

  // Fetch the logged‑in user and set adminName/adminEmail
  loadCurrentUser(): void {
    this.authService.getProfile().subscribe(
      (user: any) => {
        // Combine name and surname, or use just name if surname missing
        this.service.adminName = `${user.name || ''} ${user.surname || ''}`.trim();
        this.service.adminEmail = user.email || '';
      },
      (error) => {
        console.error('Failed to load user profile', error);
      }
    );
  }

  // Placeholder for edit – you'll need to implement fetching a single service
  loadServiceForEdit(id: number): void {
    // e.g., this.serviceService.getServiceById(id).subscribe(...)
    console.warn('Edit mode not fully implemented');
  }

  // Navigate to edit (this will be replaced by proper inline edit later)
  editService(serviceId?: number): void {
    if (serviceId !== undefined) {
      this.router.navigate(['/edit-service', serviceId]);
    } else {
      console.error('Service ID is undefined.');
    }
  }

  // Handle form submission
  submitService(): void {
    if (this.serviceId) {
      // Edit mode – update existing service
      this.serviceService.updateService(this.serviceId, this.service).subscribe(
        () => {
          this.message = 'Service updated successfully!';
          this.loadAllServices(); // refresh the list
        },
        error => {
          this.message = 'Error updating service.';
          console.error('Error:', error);
        }
      );
    } else {
      // Create mode – submit new service
      this.serviceService.createService(this.service).subscribe(
        () => {
          this.message = 'Service booked successfully!';
          this.loadAllServices(); // refresh list
          // Reset form for next entry
          this.service = {
            vehicleID: 0,
            adminName: '',
            adminEmail: '',
            startDate: new Date(),
            endDate: new Date(),
            description: ''
          };
          // Re‑populate admin fields (optional, but nice)
          this.loadCurrentUser();
        },
        error => {
          this.message = 'Error booking service.';
          console.error('Error:', error);
        }
      );
    }
  }
}