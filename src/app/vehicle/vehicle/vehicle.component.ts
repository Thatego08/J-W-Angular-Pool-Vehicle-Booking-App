import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Router } from '@angular/router';
import { Colour } from '../../models/colour.model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit{

  vehicles: Vehicle[] = [];

  vehicle!: Vehicle;

  constructor(private vehicleService: VehicleService, private router: Router) { }

  ngOnInit(): void {
    this.loadVehicles();
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


  loadVehicle(vehicle: Vehicle): void {
    this.router.navigate(['/edit-vehicle', vehicle.vehicleID]);
  }

  
  
  editVehicle(vehicleId: number){
    this.router.navigate(['/edit-vehicle', vehicleId]);
  }
  
  deleteVehicle(vehicleID: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicleID).subscribe(
        () => {
          alert('Vehicle deleted successfully.');
          // Optionally, refresh the list or handle the UI update here
        },
        error => {
          alert('Failed to delete the vehicle.');
          console.error('Delete failed', error);
        }
      );
    }
  


}
}
