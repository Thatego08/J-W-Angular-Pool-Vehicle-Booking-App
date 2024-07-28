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
        this.router.navigate(['colour'])
      }
    });
 
  }

  cancel(){
    this.router.navigate(["colour"]);
  };


  // colourForm: FormGroup;
  // colourId!: number;

  // constructor(
  //   private vs: VehicleService,
  //   private fb: FormBuilder,
  //   private router: Router,
  //   private route: ActivatedRoute
  // ) {
  //   this.colourForm = this.fb.group({
  //     name: ['', Validators.required]
  //   });
  // }

  // ngOnInit(): void {
  //   // Get the colour ID from the route parameters
  //   this.colourId = +this.route.snapshot.paramMap.get('id')!;
  //   this.loadColour();
  // }

  // loadColour(): void {
  //   this.vs.getColour(this.colourId).subscribe(data => {
  //     if (data) {
  //       this.colourForm.setValue({
  //         name: data.name
  //       });
  //     }
  //   });
  // }


  // onSubmit(): void {
  //   if (this.colourForm.valid) {
  //     const updatedColour: Colour = {
  //       id: this.colourId,
  //       name: this.colourForm.get('name')!.value
  //     };

  //     this.vs.editColour(this.colourId, updatedColour).subscribe(() => {
  //       this.router.navigateByUrl('colour');
  //     });
  //   }
  // }

  // cancel(): void{
  //   this.router.navigateByUrl('colour');
  // }
}
