import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleModel } from '../../models/vehicle-model.model';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleMakeComponent } from '../vehicle-make/vehicle-make.component';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit {
  modelForm: FormGroup;
  vehicleMakes: VehicleMake[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.modelForm = this.fb.group({
      vehicleModelName: [null, Validators.required],
      vehicleMakeId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDropdowns();
    const modelId = this.route.snapshot.paramMap.get('id');
    if (modelId) {
      this.vehicleService.getModel(+modelId).subscribe(
        data => {
          this.modelForm.patchValue(data);
        },
        error => {
          console.error('Error fetching vehicle model', error);
        }
      );
    }
  }

  loadDropdowns(): void {
    this.vehicleService.getAllVehicleMakes().subscribe(data => this.vehicleMakes = data);
  }

  onSubmit(): void {
    if (this.modelForm.valid) {
      const modelData: VehicleModel = {
        vehicleModelName: this.modelForm.get('vehicleModelName')!.value,
        vehicleMakeID: this.modelForm.get('vehicleMakeId')!.value,
        vehicleModelId: 0
      };

      this.vehicleService.addVehicleModel(modelData).subscribe(() => {
        alert('Vehicle Model:  ' + modelData.vehicleModelName + modelData.vehicleMakeName + ' added successfully')
        this.clearForm();
        this.router.navigateByUrl('/vehicle-model');
      });
    }
  }

  clearForm(): void {
    this.modelForm.reset();
  }
}
