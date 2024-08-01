import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Router } from '@angular/router';
import { Colour } from '../../models/colour.model';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleFuelType } from '../../models/fuel.model';
import { InsuranceCover } from '../../models/insurance.model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  searchQuery: string = '';
  selectedMakeId: number | null = null;
  selectedColourId: number | null = null;
  selectedFuelTypeId: number | null = null;
  selectedInsuranceCoverId: number | null = null;

  vehicleMakes: VehicleMake[] = [];
  colours: Colour[] = [];
  fuelTypes: VehicleFuelType[] = [];
  insuranceCovers: InsuranceCover[] = [];

  constructor(private vehicleService: VehicleService, private router: Router) { }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadFilters();
  }

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe(
      (data: Vehicle[]) => {
        this.vehicles = data;
        this.filteredVehicles = this.vehicles;
        this.filterVehicles(); // Apply filters on load
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  loadFilters(): void {
    this.vehicleService.getAllVehicleMakes().subscribe((data: VehicleMake[]) => this.vehicleMakes = data);
    this.vehicleService.getAllColours().subscribe((data: Colour[]) => this.colours = data);
    this.vehicleService.getAllFuelTypes().subscribe((data: VehicleFuelType[]) => this.fuelTypes = data);
    this.vehicleService.getAllInsuranceCovers().subscribe((data: InsuranceCover[]) => this.insuranceCovers = data);
  }

  filterVehicles(): void {
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      return (
        (this.selectedMakeId === null || vehicle.vehicleMakeID === this.selectedMakeId) &&
        (this.selectedColourId === null || vehicle.colourID === this.selectedColourId) &&
        (this.selectedFuelTypeId === null || vehicle.fuelTypeID === this.selectedFuelTypeId) &&
        (this.selectedInsuranceCoverId === null || vehicle.insuranceCoverID === this.selectedInsuranceCoverId) &&
        (this.searchQuery === '' || 
          vehicle.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          vehicle.registrationNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          vehicle.vin.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          vehicle.engineNo.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
    });
  }

  onSearchQueryChange(): void {
    this.filterVehicles();
  }

  onFilterChange(): void {
    this.filterVehicles();
  }

  editVehicle(vehicleID: number): void {
    this.router.navigate(['/edit-vehicle', vehicleID]);
  }

  deleteVehicle(vehicleID: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicleID).subscribe(() => {
        this.loadVehicles(); // Refresh vehicle list after deletion
      });
    }
  }
}




















// import { Component, OnInit } from '@angular/core';
// import { VehicleService } from '../../services/vehicle.service';
// import { Vehicle } from '../../models/vehicle.model';
// import { Router } from '@angular/router';
// import { Colour } from '../../models/colour.model';

// @Component({
//   selector: 'app-vehicle',
//   templateUrl: './vehicle.component.html',
//   styleUrls: ['./vehicle.component.css']
// })
// export class VehicleComponent implements OnInit{

//   vehicles: Vehicle[] = [];

//   vehicle!: Vehicle;

//   constructor(private vehicleService: VehicleService, private router: Router) { }

//   ngOnInit(): void {
//     this.loadVehicles();
//   }

//   loadVehicles(): void {
//     this.vehicleService.getAllVehicles().subscribe(
//       (data: Vehicle[]) => {
//         this.vehicles = data;
//       },
//       (error) => {
//         console.error('Error fetching vehicles:', error);
//       }
//     );
//   }


//   loadVehicle(vehicle: Vehicle): void {
//     this.router.navigate(['/edit-vehicle', vehicle.vehicleID]);
//   }

  
  
//   editVehicle(vehicleId: number){
//     this.router.navigate(['/edit-vehicle', vehicleId]);
//   }
  
//   deleteVehicle(vehicleID: number): void {
//     if (confirm('Are you sure you want to delete this vehicle?')) {
//       this.vehicleService.deleteVehicle(vehicleID).subscribe(
//         () => {
//           alert('Vehicle deleted successfully.');
//           // Optionally, refresh the list or handle the UI update here
//         },
//         error => {
//           alert('Failed to delete the vehicle.');
//           console.error('Delete failed', error);
//         }
//       );
//     }
  


// }
// }
