import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VehicleDetailsComponent } from '../vehicle-details/vehicle-details.component';

@Component({
  selector: 'app-pool-vehicles',
  templateUrl: './pool-vehicles.component.html',
  styleUrls: ['./pool-vehicles.component.css']
})
export class PoolVehicleComponent implements OnInit {

  apiUrl = 'https://localhost:7041/api/Vehicle/GetAllVehicles';
  vehicles: Vehicle[] = [];

  page: number = 1; // Default page number
  filteredVehicles: any;
  toastr: any;

  constructor(private vehicleService: VehicleService,
    private router: Router, private http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.getAllVehicles(today, tomorrow);
  }

  
  getAllVehicles(startDate: Date, endDate:Date): void {
    this.vehicleService.getAvailableVehicles(startDate, endDate).subscribe({
    next: (vehicles) => {
      this.vehicles = vehicles;
      this.filteredVehicles = this.applyAllFilters(vehicles);
    },
    error: (error) => {
      console.error('Error fetching available vehicles', error);
      this.toastr.error('Failed to fetch available vehicles.');
    }
  });
  }
  applyAllFilters(vehicles: Vehicle[]): any {
    throw new Error('Method not implemented.');
  }

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe(
      (data: Vehicle[]) => {
        this.vehicles = data;
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  editVehicle(id: number): void {
    this.router.navigate(['/edit-vehicle', id]);
  }
  
  viewVehicle(vehicle: Vehicle): void {
    this.dialog.open(VehicleDetailsComponent, {
      width: '500px',
      data: vehicle
    });
  }

  completeChecklist(vehicle: any) {
    this.router.navigate(['/checklist'], { queryParams: { name: vehicle.name, registrationNumber: vehicle.registrationNumber } });
  }

}
