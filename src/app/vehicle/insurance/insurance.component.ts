import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { InsuranceCover } from '../../models/insurance.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {

  insurances: InsuranceCover[] = [];

  constructor(private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCovers();
  }

  loadCovers(): void {
    this.vehicleService.getAllInsuranceCovers().subscribe(
      (insurances: InsuranceCover[]) => {
        console.log('Received insurance covers:', insurances);
        this.insurances = insurances;
      },
      (error) => {
        console.error('Error fetching insurance covers:', error);
      }
    );
  }

  deleteInsurance(insuranceId: number): void {
    if (confirm('Are you sure you want to delete this insurance cover?')) {
      this.vehicleService.deleteInsuranceCover(insuranceId).subscribe(
        () => {
          alert('Insurance Cover deleted successfully.');
          // Optionally, refresh the list or handle the UI update here
        },
        error => {
          alert('Failed to delete the insurance cover.');
          console.error('Delete failed', error);
        }
      );
    }}

  navigateToEditInsurance(insuranceId: number): void {
    this.router.navigate(['/edit-insurance', insuranceId]);
  }
}
