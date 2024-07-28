import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Colour } from '../../models/colour.model';
import { Status } from '../../models/status.model';
import { VehicleFuelType } from '../../models/fuel.model';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleModel } from '../../models/vehicle-model.model';
import { Vehicle } from '../../models/vehicle.model';
import { InsuranceCover } from '../../models/insurance.model';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {
  colours: Colour[] = [];
  colourForm: FormGroup;

  constructor(private vs: VehicleService, private fb: FormBuilder, private router: Router) {
    this.colourForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Optionally, you can load existing colours if needed
    this.loadColours();
  }

  loadColours(): void {
    this.vs.getAllColours().subscribe(data => {
      this.colours = data;
    });
  }

  onSubmit(): void {
    if (this.colourForm.valid) {
      const colourData: Colour = {
        name: this.colourForm.get('name')!.value,
        id: 0
      };

      this.vs.addColour(colourData).subscribe(() => {
        this.clearForm();
        this.router.navigateByUrl('colours');
      });
    }
  }

  clearForm(): void {
    this.colourForm.reset();
  }
}
