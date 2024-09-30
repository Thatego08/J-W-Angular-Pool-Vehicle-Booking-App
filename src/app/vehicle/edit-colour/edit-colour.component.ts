import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Colour } from '../../models/colour.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-colour',
  templateUrl: './edit-colour.component.html',
  styleUrls: ['./edit-colour.component.css']
})
export class EditColourComponent implements OnInit {
  
  colour: Colour = {
    id: 0,
    name: ''
  };

  constructor(private route: ActivatedRoute, private vs: VehicleService, private router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        //Call the API
        if(id){
          this.vs.getColourId(id).subscribe({
            next: (response) => {
              this.colour = response;
            }
          });
        }
      }
    })
  }

  updateColour(){
    this.vs.updateColour(this.colour.id, this.colour).subscribe({
      next: (response) =>{
        alert('This colour has been updated successfully.');
        this.router.navigate(['colour'])
      }
    });
 
  }

  cancel(){
    this.router.navigate(["colour"]);
  };

}
