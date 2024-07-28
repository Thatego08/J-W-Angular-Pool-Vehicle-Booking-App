import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleFuelType } from '../../models/fuel.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-add-fuel',
  templateUrl: './add-fuel.component.html',
  styleUrls: ['./add-fuel.component.css']
})
export class AddFuelComponent implements OnInit{
  fuels: VehicleFuelType[] = [];
  fuelForm: FormGroup;

  constructor(private vs: VehicleService, private fb: FormBuilder, private router: Router) {
    this.fuelForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Optionally, you can load existing colours if needed
    this.loadFuels();
  }

  loadFuels(): void {
    this.vs.getAllFuelTypes().subscribe(data => {
      this.fuels = data;
    });
  }

  onSubmit(): void {
    if (this.fuelForm.valid) {
      const fuelData: VehicleFuelType = {
        fuelName: this.fuelForm.get('name')!.value,
        id: 0
      };

      this.vs.addFuelType(fuelData).subscribe(() => {
        this.clearForm();
        this.router.navigateByUrl('fuel-type');
      });
    }
  }

  clearForm(): void {
    this.fuelForm.reset();
  }
}
