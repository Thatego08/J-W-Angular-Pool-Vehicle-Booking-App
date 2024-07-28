import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleModel } from '../../models/vehicle-model.model';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.css']
})
export class EditModelComponent implements OnInit {

  modelForm: FormGroup;
  vehicleMakes: VehicleMake[] = [];
  vehicleModelId!: number;

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
    this.vehicleModelId = +this.route.snapshot.paramMap.get('id')!;
    if (this.vehicleModelId) {
      this.vehicleService.getModel(this.vehicleModelId).subscribe(
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
      const updatedModel: VehicleModel = {
        vehicleModelId: this.vehicleModelId,
        vehicleModelName: this.modelForm.get('vehicleModelName')!.value,
        vehicleMakeID: this.modelForm.get('vehicleMakeId')!.value,
        vehicleMakeName: '',
      };

      this.vehicleService.editVehicleModel(this.vehicleModelId, updatedModel).subscribe(() => {
        this.router.navigateByUrl('/vehicle-model');
      });
    }
  }

  cancel(): void {
    this.router.navigateByUrl('/vehicle-model');
  }
}
