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
    vehicleId: 0,
    adminName: '',
    adminEmail: '',
    serviceDate: new Date(),
    description: ''
  };
  vehicles: Vehicle[] = [];
  message: string = '';

  constructor(
    private serviceService: ServiceService,
    private vehicleService: VehicleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.vehicleService.getAllVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });
  }

  submitService(): void {
    this.serviceService.createService(this.service).subscribe(
      () => {
        this.message = 'Service booked successfully!';
        this.router.navigate(['/manage-vehicle']); // Redirect after successful submission
      },
      error => {
        this.message = 'Error booking service.';
        console.error('Error:', error);
      }
    );
  }

}