import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Colour } from '../../models/colour.model';
import { InsuranceCover } from '../../models/insurance.model';
import { VehicleFuelType } from '../../models/fuel.model';
import { Status } from '../../models/status.model';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleModel } from '../../models/vehicle-model.model';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {
  editVehicleForm!: FormGroup;
  vehicle: Vehicle = {
    vehicleID: 0,
    name: '',
    description: '',
    dateAcquired: new Date(),
    licenseExpiryDate: new Date(),
    registrationNumber: '',
    insuranceCoverID: 0,
    vin: '',
    engineNo: '',
    colourID: 0,
    fuelTypeID: 0,
    statusID: 0,
    vehicleMakeID: 0,
    vehicleModelID: 0,
    compliance: '',  // 'Compliant', 'Non-Compliant'
    protection: '', // 'Full', 'Partial', 'None'

     cabinType: '',     // 'Double', 'Single', 'Extra', etc.
  driveType: '',     // '4x4', '4x2'
  transmission: '',  // 'Manual', 'Automatic'
  hasTowBar: false,
  hasCanopy: false
  };
  colours: Colour[] = [];
  insuranceCovers: InsuranceCover[] = [];
  fuelTypes: VehicleFuelType[] = [];
  statuses: Status[] = [];
  vehicleMakes: VehicleMake[] = [];
  vehicleModels: VehicleModel[] = [];
  filteredVehicleModels: VehicleModel[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.editVehicleForm = this.fb.group({
      vehicleID: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: ['', Validators.required],
      dateAcquired: ['', Validators.required],
      licenseExpiryDate: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      vin: ['', Validators.required],
      engineNo: ['', Validators.required],
      insuranceCoverID: ['', Validators.required],
      colourID: ['', Validators.required],
      fuelTypeID: ['', Validators.required],
      statusID: ['', Validators.required],
      vehicleMakeID: ['', Validators.required],
      vehicleModelID: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.vehicleService.getVehicleId(id).subscribe(data => {
          this.vehicle = data;
          this.editVehicleForm.patchValue({
            ...this.vehicle,
            dateAcquired: new Date(this.vehicle.dateAcquired).toISOString().substring(0, 10),
            licenseExpiryDate: new Date(this.vehicle.licenseExpiryDate).toISOString().substring(0, 10)
          });

          // Load dropdown data after vehicle data is fetched
          this.loadVehicleData();
        });
      }
    });

    // Subscribe to changes in the Vehicle Make field to update the Vehicle Model dropdown
    this.editVehicleForm.get('vehicleMakeID')?.valueChanges.subscribe(makeID => {
      this.filterVehicleModels(makeID);
    });
  }

  loadVehicleData(): void {
    // Load all dropdown data
    this.vehicleService.getAllColours().subscribe(data => this.colours = data);
    this.vehicleService.getAllInsuranceCovers().subscribe(data => this.insuranceCovers = data);
    this.vehicleService.getAllFuelTypes().subscribe(data => this.fuelTypes = data);
    this.vehicleService.getAllStatus().subscribe(data => this.statuses = data);
    this.vehicleService.getAllVehicleMakes().subscribe(data => {
      this.vehicleMakes = data;
      this.loadVehicleModels();
    });
  }

  loadVehicleModels(): void {
    this.vehicleService.getAllVehicleModels().subscribe(models => {
      this.vehicleModels = models;
      this.filterVehicleModels(this.editVehicleForm.get('vehicleMakeID')?.value);
    });
  }

  filterVehicleModels(vehicleMakeID: number | null): void {
    if (vehicleMakeID !== null) {
      this.vehicleService.getVehicleModelsByMake(vehicleMakeID).subscribe(models => {
        this.filteredVehicleModels = models;
        // Set the vehicle model to null if the selected model is not available
        if (this.editVehicleForm.get('vehicleModelID')?.value && !this.filteredVehicleModels.some(model => model.vehicleModelID === this.editVehicleForm.get('vehicleModelID')?.value)) {
          this.editVehicleForm.get('vehicleModelID')?.setValue(null);
        }
      });
    } else {
      this.filteredVehicleModels = [];
    }
  }

  onSubmit(): void {
    if (this.editVehicleForm.valid) {
      const updatedVehicle: Vehicle = { 
        ...this.editVehicleForm.value, 
        vehicleID: this.vehicle.vehicleID 
      };
  
      this.vehicleService.updateVehicle(this.vehicle.vehicleID, updatedVehicle).subscribe({
        next: () => {
          alert('This vehicle has been updated successfully.');
          this.router.navigate(['/vehicles']);
        },
        error: (err) => {
          console.error('Error updating vehicle', err);
          alert('An error occurred while updating the vehicle. Please try again.');
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }
  

  cancel(): void {
    this.router.navigate(['/vehicles']);
  }
}
