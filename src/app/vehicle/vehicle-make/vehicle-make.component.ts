import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleMake } from '../../models/vehicle-make.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-make',
  templateUrl: './vehicle-make.component.html',
  styleUrls: ['./vehicle-make.component.css']
})
export class VehicleMakeComponent implements OnInit{
  vehicleMakes: VehicleMake[] = [];

  constructor(private vs: VehicleService,
    private router: Router
  ) {}

 ngOnInit(): void {
   this.loadVehicleMakes();
 }


  loadVehicleMakes(): void {
    this.vs.getAllVehicleMakes().subscribe(
      (data: VehicleMake[]) => {
        this.vehicleMakes = data;
      },
      (error) => {
        console.error('Error fetching Vehicle Makes:', error);
      }
    );
  }

  deleteMake(makeId: number): void {
    if (confirm('Are you sure you want to delete this vehicle make?')) {
      this.vs.deleteVehicleMake(makeId).subscribe(
        () => {
          alert('Vehicle make deleted successfully.');
          // Optionally, refresh the list or handle the UI update here
        },
        error => {
          alert('Failed to delete the vehicle make.');
          console.error('Delete failed', error);
        }
      );
    }
  }

  navigateToEditMake(makeId: number): void {
    this.router.navigate(['/edit-make', makeId]);
  }
}

