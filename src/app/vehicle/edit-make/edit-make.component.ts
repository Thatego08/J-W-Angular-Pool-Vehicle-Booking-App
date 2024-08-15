import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-make',
  templateUrl: './edit-make.component.html',
  styleUrls: ['./edit-make.component.css']
})
export class EditMakeComponent implements OnInit {
  
   
  make: VehicleMake = {
    vehicleMakeID: 0,
    name: ''
  };

  constructor(private route: ActivatedRoute, private vs: VehicleService, private router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const vehicleMakeID = params.get('vehicleMakeID');

        //Call the API
        if(vehicleMakeID){
          this.vs.getMakeId(vehicleMakeID).subscribe({
            next: (response) => {
              this.make = response;
            }
          });
        }
      }
    })
  }

  updateMake(){
    this.vs.editVehicleMake(this.make.vehicleMakeID, this.make).subscribe({
      next: (response) =>{
        this.router.navigate(['vehicle-make'])
      }
    });
 
  }

  cancel(){
    this.router.navigate(["vehicle-make"]);
  };
}
