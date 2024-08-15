import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InsuranceCover } from '../../models/insurance.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-insurance',
  templateUrl: './edit-insurance.component.html',
  styleUrls: ['./edit-insurance.component.css']
})
export class EditInsuranceComponent implements OnInit {
  
  insurance: InsuranceCover = {
    insuranceCoverId: 0,
    insuranceCoverName: ''
  };

  constructor(private route: ActivatedRoute, private vs: VehicleService, private router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const insuranceCoverId = params.get('insuranceCoverId');

        //Call the API
        if(insuranceCoverId){
          this.vs.getCoverId(insuranceCoverId).subscribe({
            next: (response) => {
              this.insurance = response;
            }
          });
        }
      }
    })
  }

  updateCover(){
    this.vs.updateCover(this.insurance.insuranceCoverId, this.insurance).subscribe({
      next: (response) =>{
        this.router.navigate(['insurance'])
      }
    });
 
  }

  cancel(){
    this.router.navigate(["insurance"]);
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
