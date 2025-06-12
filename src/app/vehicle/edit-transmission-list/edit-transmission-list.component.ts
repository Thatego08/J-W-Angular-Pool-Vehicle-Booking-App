import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-transmission-list',
  templateUrl: './edit-transmission-list.component.html',
  styleUrl: './edit-transmission-list.component.css'
})
export class EditTransmissionListComponent {

  transmissionForm: FormGroup;
  transmissionId: number;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.transmissionForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.transmissionId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.vehicleService.getTransmission(this.transmissionId).subscribe({
      next: (transmission: { name: any; }) => {
        this.transmissionForm.patchValue({
          name: transmission.name
        });
      },
      error: (err: any) => console.error('Error fetching transmission', err)
    });
  }

  onSubmit(): void {
    if (this.transmissionForm.valid) {
      this.vehicleService.updateTransmission(
        this.transmissionId, 
        this.transmissionForm.value
      ).subscribe({
        next: () => {
          alert('Transmission updated successfully');
          this.router.navigate(['/transmission']);
        },
        error: (err: any) => console.error('Error updating transmission', err)
      });
    }
  }
}
