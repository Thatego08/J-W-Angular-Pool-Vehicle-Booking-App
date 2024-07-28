import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleFuelType } from '../../models/fuel.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-fuel',
  templateUrl: './edit-fuel.component.html',
  styleUrls: ['./edit-fuel.component.css']
})
export class EditFuelComponent implements OnInit {
  
  fuel: VehicleFuelType = {
    id: 0,
    fuelName: ''
  };

  constructor(private route: ActivatedRoute, private vs: VehicleService, private router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        //Call the API
        if(id){
          this.vs.getFuelId(id).subscribe({
            next: (response) => {
              this.fuel = response;
            }
          });
        }
      }
    })
  }

  updateFuel(){
    this.vs.editFuelType(this.fuel.id, this.fuel).subscribe({
      next: (response) =>{
        this.router.navigate(['fuel-type'])
      }
    });
 
  }

  cancel(){
    this.router.navigate(["fuel-type"]);
  };

}
