import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InsuranceCover } from '../../models/insurance.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-add-insurance',
  templateUrl: './add-insurance.component.html',
  styleUrls: ['./add-insurance.component.css']
})
export class AddInsuranceComponent implements OnInit {
  covers: InsuranceCover[] = [];
  coverForm: FormGroup;

  constructor(private vs: VehicleService, private fb: FormBuilder, private router: Router) {
    this.coverForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Optionally, you can load existing colours if needed
    this.loadCovers();
  }

  loadCovers(): void {
    this.vs.getAllInsuranceCovers().subscribe(data => {
      this.covers = data;
    });
  }

  onSubmit(): void {
    if (this.coverForm.valid) {
      const coverData: InsuranceCover = {
        insuranceCoverName: this.coverForm.get('name')!.value,
        insuranceCoverId: 0
      };

      this.vs.addInsuranceCover(coverData).subscribe(() => {
        this.clearForm();
        this.router.navigateByUrl('insurance');
      });
    }
  }

  clearForm(): void {
    this.coverForm.reset();
  }
}