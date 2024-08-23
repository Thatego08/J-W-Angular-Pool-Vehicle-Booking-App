import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RefuelVehicleService } from '../refuelvehicle.service';
import { RefuelVehicle } from '../refuel-vehicle';

@Component({
  selector: 'app-refuel-vehicle',
  templateUrl: './refuel-vehicle.component.html',
  styleUrls: ['./refuel-vehicle.component.css']
})
export class RefuelVehicleComponent implements OnInit {
  refuelVehicleForm: FormGroup;
  successMessage: string | null = null;  // Add successMessage variable

  fields = [
    { label: 'Oil Level', name: 'oilLevel' },
    { label: 'Tyre Pressure', name: 'tyrePressure' },
    { label: 'Tyre Condition', name: 'tyreCondition' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private refuelVehicleService: RefuelVehicleService,
    private route: ActivatedRoute
  ) {
    this.refuelVehicleForm = this.formBuilder.group({
      tripId: [''],
      oilLevel: [''],
      tyrePressure: [''],
      tyreCondition: [''],
      comments: [''],
      fuelQuantity: [''],
      fuelCost: ['']
    });
  }

  ngOnInit(): void {
    // Retrieve tripId from URL and set it to the form
    this.route.paramMap.subscribe(params => {
      const tripId = params.get('tripId');
      if (tripId !== null) {
        this.refuelVehicleForm.get('tripId')?.setValue(+tripId); // Convert to number if needed
      }
    });
  }

  onSubmit(): void {
    if (this.refuelVehicleForm.valid) {
      const refuelVehicle: RefuelVehicle = this.refuelVehicleForm.value;

      this.refuelVehicleService.addRefuelVehicle(refuelVehicle).subscribe(
        (response: RefuelVehicle) => {
          console.log('Refuel Vehicle submitted successfully:', response);
          this.successMessage = 'Refuel Vehicle submitted successfully!';  // Set success message
          this.refuelVehicleForm.reset();  // Reset the form after successful submission

          // Optionally hide the success message after a delay
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);  // Hide after 3 seconds
        },
        (error: any) => {
          console.error('Error submitting refuel vehicle:', error);
          // Handle error response, e.g., show an error message
        }
      );
    }
  }
}