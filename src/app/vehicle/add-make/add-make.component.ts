import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleMake } from '../../models/vehicle-make.model';

@Component({
  selector: 'app-add-make',
  templateUrl: './add-make.component.html',
  styleUrls: ['./add-make.component.css']
})
export class AddMakeComponent implements OnInit {
  vehicleMakes: VehicleMake[] = [];
  makeForm: FormGroup;

  constructor(private vs: VehicleService, private fb: FormBuilder, private router: Router) {
    this.makeForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Optionally, you can load existing colours if needed
    this.loadMakes();
  }

  loadMakes(): void {
    this.vs.getAllVehicleMakes().subscribe(data => {
      this.vehicleMakes = data;
    });
  }

  onSubmit(): void {
    if (this.makeForm.valid) {
      const makeData: VehicleMake = {
        name: this.makeForm.get('name')!.value,
        vehicleMakeID: 0
      };

      this.vs.addVehicleMake(makeData).subscribe(() => {
        this.clearForm();
        this.router.navigateByUrl('vehicle-make');
      });
    }
  }

  clearForm(): void {
    this.makeForm.reset();
  }

}
