import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Colour } from '../../models/colour.model';
import { VehicleFuelType } from '../../models/fuel.model';
import { InsuranceCover } from '../../models/insurance.model';
import { Status } from '../../models/status.model';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleModel } from '../../models/vehicle-model.model';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {
  vehicleForm!: FormGroup;
  colours: Colour[] = [];
  fuelTypes: VehicleFuelType[] = [];
  insuranceCovers: InsuranceCover[] = [];
  statuses: Status[] = [];
  vehicleMakes: VehicleMake[] = [];
  vehicleModels: VehicleModel[] = [];

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownData();
  }

  initializeForm(): void {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      dateAcquired: ['', Validators.required],
      licenseExpiryDate: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      vin: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      engineNo: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      colourID: ['', Validators.required],
      fuelTypeID: ['', Validators.required],
      statusID: ['', Validators.required],
      vehicleMakeID: ['', Validators.required],
      vehicleModelID: ['', Validators.required],
      insuranceCoverID: ['', Validators.required]
    });
  }

  loadDropdownData(): void {
    this.vehicleService.getAllColours().subscribe(
      data => this.colours = data,
      error => console.error('Error loading colours:', error)
    );
    this.vehicleService.getAllFuelTypes().subscribe(
      data => this.fuelTypes = data,
      error => console.error('Error loading fuel types:', error)
    );
    this.vehicleService.getAllInsuranceCovers().subscribe(
      data => this.insuranceCovers = data,
      error => console.error('Error loading insurance covers:', error)
    );
    this.vehicleService.getAllStatus().subscribe(
      data => this.statuses = data,
      error => console.error('Error loading statuses:', error)
    );
    this.vehicleService.getAllVehicleMakes().subscribe(
      data => this.vehicleMakes = data,
      error => console.error('Error loading vehicle makes:', error)
    );
    this.vehicleService.getAllVehicleModels().subscribe(
      data => this.vehicleModels = data,
      error => console.error('Error loading vehicle models:', error)
    );
  }

  onSubmit(): void {

    console.log(this.vehicleForm);
    if (this.vehicleForm.valid) {
      const newVehicle: Vehicle = this.vehicleForm.value;
      console.log('Submitting vehicle data:', newVehicle);
      this.vehicleService.addVehicle(newVehicle).subscribe(
        response => {
          alert(`Vehicle ${newVehicle.name} added successfully`);
          this.vehicleForm.reset();
        },
        error => {
          //alert('Error adding vehicle: ' + error.message);
          console.error('Error details:', error);
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
