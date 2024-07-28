import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-make',
  templateUrl: './edit-make.component.html',
  styleUrls: ['./edit-make.component.css']
})
export class EditMakeComponent implements OnInit {

  makeForm: FormGroup;
  makeId!: number;

  constructor(
    private vs: VehicleService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.makeForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the make ID from the route parameters
    this.makeId = +this.route.snapshot.paramMap.get('id')!;
    this.loadmake();
  }

  loadmake(): void {
    this.vs.getMake(this.makeId).subscribe(data => {
      if (data) {
        this.makeForm.setValue({
          name: data.name
        });
      }
    });
  }


  onSubmit(): void {
    if (this.makeForm.valid) {
      const updatedMake: VehicleMake = {
        vehicleMakeID: this.makeId,
        name: this.makeForm.get('name')!.value
      };

      this.vs.editVehicleMake(this.makeId, updatedMake).subscribe(() => {
        this.router.navigateByUrl('vehicle-make');
      });
    }
  }

  cancel(): void{
    this.router.navigateByUrl('vehicle-make');
  }
}
