import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
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
    serviceDate: new Date(),
    description: '',
    
  };
  vehicles: Vehicle[] = [];
  services: Service[] = [];
  message: string = '';
  serviceId!: number;

  constructor(
    private serviceService: ServiceService,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.vehicleService.getAllVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });

    this.loadAllServices();
    // Check if the serviceId is present in the route (edit mode)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.serviceId = +id; // Convert string to number
        this.editService(this.serviceId); // Load service details for editing
      }
    });
  }

  // Method to load all services
  loadAllServices(): void {
    this.serviceService.getAllServices().subscribe(services => {
      this.services = services;
    });
  }

  // Method to load service details for editing
  editService(serviceId?: number): void {
    if (serviceId !== undefined) {
      this.router.navigate(['/edit-service', serviceId]);
    } else {
      console.error('Service ID is undefined.');
    }
  }

  // Method to handle form submission (create or update service)
  submitService(): void {
    if (this.serviceId) {
      // Edit mode: Update the existing service
      this.serviceService.updateService(this.serviceId, this.service).subscribe(
        () => {
          this.message = 'Service updated successfully!';
           // Redirect after successful update
        },
        error => {
          this.message = 'Error updating service.';
          console.error('Error:', error);
        }
      );
    } else {
      // Create mode: Submit new service
      this.serviceService.createService(this.service).subscribe(
        () => {
          this.message = 'Service booked successfully!';
           
        },
        error => {
          this.message = 'Error booking service.';
          console.error('Error:', error);
        }
      );
    }
  }

}