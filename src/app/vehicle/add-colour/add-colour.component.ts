import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Colour } from '../../models/colour.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-add-colour',
  templateUrl: './add-colour.component.html',
  styleUrls: ['./add-colour.component.css']
})
export class AddColourComponent implements OnInit {
  colours: Colour[] = [];
  colourForm: FormGroup;

  constructor(private vs: VehicleService, private fb: FormBuilder, private router: Router) {
    this.colourForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Optionally, you can load existing colours if needed
    this.loadColours();
  }

  loadColours(): void {
    this.vs.getAllColours().subscribe(data => {
      this.colours = data;
    });
  }

  onSubmit(): void {
    if (this.colourForm.valid) {
      const colourData: Colour = {
        name: this.colourForm.get('name')!.value,
        id: 0
      };

      this.vs.addColour(colourData).subscribe(() => {
        this.clearForm();
        alert('Colour ' + colourData.name + ' added successfully')
        this.router.navigateByUrl("colours");
      });
    }
  }

  clearForm(): void {
    this.colourForm.reset();
  }

}
