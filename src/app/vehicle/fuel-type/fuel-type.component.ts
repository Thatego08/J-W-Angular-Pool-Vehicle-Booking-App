import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleFuelType } from '../../models/fuel.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fuel-type',
  templateUrl: './fuel-type.component.html',
  styleUrls: ['./fuel-type.component.css']
})
export class FuelTypeComponent implements OnInit {

  fuelTypes: VehicleFuelType[] = [];

  constructor(private vs: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFuels();
  }

  loadFuels(): void {
    this.vs.getAllFuelTypes().subscribe(
      (data: VehicleFuelType[]) => {
        this.fuelTypes = data;
      },
      (error) => {
        console.error('Error fetching fuel types:', error);
      }
    );
  }

  deleteFuel(fuelId: number): void {
    if (confirm('Are you sure you want to delete this fuel type?')) {
      this.vs.deleteFuelType(fuelId).subscribe(
        () => {
          alert('Fuel Type deleted successfully.');
          // Optionally, refresh the list or handle the UI update here
        },
        error => {
          alert('Failed to delete the fuel type.');
          console.error('Delete failed', error);
        }
      );
    }}

  navigateToEditFuel(fuelId: number): void {
    this.router.navigate(['/edit-fuel', fuelId]);
  }
}
