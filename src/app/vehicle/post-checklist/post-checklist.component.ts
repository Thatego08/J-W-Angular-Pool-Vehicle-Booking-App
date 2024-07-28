import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChecklistService } from '../../services/checklist.service';
import { PostChecklist } from '../../models/postchecklist.model';
import { VehicleChecklist } from '../../models/checklist.model';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { DriverService } from '../../services/driver.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-post-checklist',
  templateUrl: './post-checklist.component.html',
  styleUrls: ['./post-checklist.component.css']
})
export class PostChecklistComponent implements OnInit {
  checklistForm!: FormGroup;
  postChecklistForm!: FormGroup;
  isFormCompleted: boolean = false;
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router,
    private driverService: DriverService,
    private userService: UserService,
    private checklistService: ChecklistService
  ) {}

  ngOnInit(): void {
    this.checklistForm = this.fb.group({
      selectedVehicleId: [null, Validators.required],
      selectedDriverId: [null, Validators.required],
      registration: [{ value: '', disabled: true }],
      ExteriorChecks: this.fb.group({
        mirrors: [false],
        oilWaterLeaks: [false],
        headLights: [false],
        parkLights: [false],
        brakeLights: [false],
        strobeLights: [false],
        reverseLight: [false],
        tyreCondition: [false],
        spareWheelPresent: [false],
        damageToInteriorBodyWork: [false],
        marketingMagnets: [false]
      }),
      InteriorChecks: this.fb.group({
        horn: [false],
        seatbelt: [false],
        sunVisor: [false],
        sunblock: [false],
        windscreen: [false]
      }),
      UnderTheHoodChecks: this.fb.group({
        fuelLevel: [false]
      }),
      FunctionalTests: this.fb.group({
        indicator: [false],
        reverseHooter: [false],
        brake: [false],
        handbrake: [false]
      }),
      SafetyEquipment: this.fb.group({
        fireExtinguisher: [false],
        inspectionValid: [false],
        triangleInPlace3x: [false],
        jackWheelPresent: [false]
      }),
      Documentation: this.fb.group({
        licenseDisks: [false],
        checkedBySecurity: [false],
        inspection: [false]
      })
    });

    this.postChecklistForm = this.fb.group({
      tripId: [null, Validators.required],
      username: [null, Validators.required],
      vehicleId: [null, Validators.required],
      openingKms: [null, Validators.required],
      closingKms: [null, Validators.required],
      distanceTravelled: [null],
      returnVehicle: [false, Validators.requiredTrue],
      ExteriorChecks: this.fb.group({
        mirrors: [false],
        oilWaterLeaks: [false],
        headLights: [false],
        parkLights: [false],
        brakeLights: [false],
        strobeLights: [false],
        reverseLight: [false],
        tyreCondition: [false],
        spareWheelPresent: [false],
        damageToInteriorBodyWork: [false],
        marketingMagnets: [false]
      }),
      InteriorChecks: this.fb.group({
        horn: [false],
        seatbelt: [false],
        sunVisor: [false],
        sunblock: [false],
        windscreen: [false]
      }),
      UnderTheHoodChecks: this.fb.group({
        fuelLevel: [false]
      }),
      FunctionalTests: this.fb.group({
        indicator: [false],
        reverseHooter: [false],
        brake: [false],
        handbrake: [false]
      }),
      SafetyEquipment: this.fb.group({
        fireExtinguisher: [false],
        inspectionValid: [false],
        triangleInPlace3x: [false],
        jackWheelPresent: [false]
      }),
      Documentation: this.fb.group({
        licenseDisks: [false],
        checkedBySecurity: [false],
        inspection: [false]
      })
    });

    this.vehicleService.getAllVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });

    this.checklistForm.get('selectedVehicleId')?.valueChanges.subscribe(vehicleId => {
      this.selectedVehicle = this.vehicles.find(vehicle => vehicle.vehicleID === vehicleId) || null;
      if (this.selectedVehicle) {
        this.checklistForm.patchValue({
          registration: this.selectedVehicle.registrationNumber,
        });
      }
    });

    this.checklistForm.valueChanges.subscribe(() => {
      this.isFormCompleted = this.checklistForm.valid;
    });
  }

  onSubmitChecklist(): void {
    if (this.checklistForm.valid) {
      const checklistData: VehicleChecklist = this.checklistForm.value;
      this.checklistService.addVehicleChecklist(checklistData).subscribe(response => {
        console.log('Vehicle Checklist submitted successfully', response);
        this.router.navigate(['/trip']);
      });
    }
  }

  onSubmitPostChecklist(): void {
    if (this.postChecklistForm.valid) {
      const postChecklistData: PostChecklist = this.postChecklistForm.value;
      this.checklistService.addPostChecklist(postChecklistData).subscribe(response => {
        console.log('Post Checklist submitted successfully', response);
        this.router.navigate(['/trip']);
      });
    } else {
      console.error('Form is not valid');
    }
  }

  onReady(): void {
    this.router.navigate(['/trip']); // Adjust to your trip page route
  }

  selectAllChecks(groupName: string): void {
    const group = this.checklistForm.get(groupName) as FormGroup;
    Object.keys(group.controls).forEach(key => {
      group.get(key)?.patchValue(true);
    });
  }

  autoFillChecklist(): void {
    this.checklistForm.patchValue({
      ExteriorChecks: {
        mirrors: true,
        oilWaterLeaks: true,
        headLights: true,
        parkLights: true,
        brakeLights: true,
        strobeLights: true,
        reverseLight: true,
        tyreCondition: true,
        spareWheelPresent: true,
        damageToInteriorBodyWork: true,
        marketingMagnets: true
      },
      InteriorChecks: {
        horn: true,
        seatbelt: true,
        sunVisor: true,
        sunblock: true,
        windscreen: true
      },
      UnderTheHoodChecks: {
        fuelLevel: true
      },
      FunctionalTests: {
        indicator: true,
        reverseHooter: true,
        brake: true,
        handbrake: true
      },
      SafetyEquipment: {
        fireExtinguisher: true,
        inspectionValid: true,
        triangleInPlace3x: true,
        jackWheelPresent: true
      },
      Documentation: {
        licenseDisks: true,
        checkedBySecurity: true,
        inspection: true
      }
    });
  }
}
