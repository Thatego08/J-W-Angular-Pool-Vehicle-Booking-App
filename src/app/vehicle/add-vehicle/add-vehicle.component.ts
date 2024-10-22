import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router for navigation
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
  submissionStatus: string | null = null;

  colours: Colour[] = [];
  fuelTypes: VehicleFuelType[] = [];
  insuranceCovers: InsuranceCover[] = [];
  statuses: Status[] = [];
  vehicleMakes: VehicleMake[] = [];
  vehicleModels: VehicleModel[] = [];
  selectedModelID: number | null = null;
  selectedMakeID: number | null = null;
  minDate: string;
  maxDate: string;


  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  notificationMessage: string | null = null;
  isSuccess: boolean = true;
 

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router // Inject Router for navigation
  ) {//
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1); // Subtract one day

    // Format both dates as YYYY-MM-DD
    this.maxDate = today.toISOString().slice(0, 10); // Today's date
    this.minDate = yesterday.toISOString().slice(0, 10); // Yesterday's date
  
  } 

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
      statusID: [1] ,
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

  

  onMakeSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const makeId = Number(target.value);

    if (!isNaN(makeId)) {
      this.vehicleService.getVehicleModelsByMake(makeId).subscribe(
        (models) => {
          this.vehicleModels = models;
        },
        (error) => {
          console.error('Error retrieving vehicle models', error);
          this.vehicleModels = []; // Reset models on error
        }
      );
    } else {
      this.vehicleModels = []; // Reset vehicle models if no make is selected
    }
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      const vehicle: Vehicle = this.vehicleForm.value;
      this.vehicleService.addVehicle(vehicle).subscribe(
        () => {
          this.submissionStatus = 'Vehicle added successfully!';
          this.vehicleForm.reset(); // Reset form after successful submission
        },
        error => {
          this.submissionStatus = `Error adding vehicle: ${error.message}`;
        }
      );
    }
  }

  // onSubmit(): void {
  //   if (this.vehicleForm.valid) {
  //     const newVehicle = { ...this.vehicleForm.value, statusID: 1 }; // Set statusID to 1 (Available)
  
  //     this.vehicleService.addVehicle(newVehicle).subscribe(
  //       response => {
  //         alert(`Vehicle ${newVehicle.name} - ${newVehicle.registrationNumber} added successfully`);
  //         this.router.navigate(['/vehicles']); // Redirect to the vehicles page or any other desired page
  //       },
  //       error => {
  //         console.error('Error adding vehicle:', error);
  //       }
  //     );
  //   } else {
  //     alert('Please fill in all required fields.');
  //   }
  // }
}