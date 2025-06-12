import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-add-transmission',
  templateUrl: './add-transmission.component.html',
  styleUrls: ['./add-transmission.component.css']
})
export class AddTransmissionComponent {
  transmissionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router
  ) {
    this.transmissionForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.transmissionForm.valid) {
      this.vehicleService.addTransmission(this.transmissionForm.value).subscribe({
        next: () => {
          alert('Transmission added successfully');
          this.router.navigate(['/transmission']);
        },
        error: (err) => console.error('Error adding transmission', err)
      });
    }
  }
}