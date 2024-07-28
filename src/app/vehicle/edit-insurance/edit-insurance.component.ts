import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InsuranceCover } from '../../models/insurance.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-insurance',
  templateUrl: './edit-insurance.component.html',
  styleUrls: ['./edit-insurance.component.css']
})
export class EditInsuranceComponent implements OnInit {

  coverForm: FormGroup;
  insuranceId!: number;

  constructor(
    private vs: VehicleService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.coverForm = this.fb.group({
      insuranceCoverName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the colour ID from the route parameters
    this.insuranceId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCover();
  }

  loadCover(): void {
    this.vs.getInsurance(this.insuranceId).subscribe(data => {
      if (data) {
        this.coverForm.setValue({
          insuranceCoverName: data.insuranceCoverName
        });
      }
    });
  }


  onSubmit(): void {
    if (this.coverForm.valid) {
      const updatedCover: InsuranceCover = {
        insuranceCoverId: this.insuranceId,
        insuranceCoverName: this.coverForm.get('insuranceCoverName')!.value
      };

      this.vs.editInsuranceCover(this.insuranceId, updatedCover).subscribe(() => {
        this.router.navigateByUrl('insurance');
      });
    }
  }

  cancel(): void{
    this.router.navigateByUrl('insurance');
  }

}
