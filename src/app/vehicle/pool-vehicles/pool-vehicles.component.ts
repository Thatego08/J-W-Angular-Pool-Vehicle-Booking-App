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

  constructor(private vehicleService: VehicleService,
    private router: Router, private http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllVehicles();
  }

  
  getAllVehicles(): void {
    this.vehicleService.getAvailableVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });
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
