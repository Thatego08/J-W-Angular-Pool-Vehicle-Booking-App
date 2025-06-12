import { Component } from '@angular/core';
import { Transmission } from '../../models/transmission.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-transmission-list',
  templateUrl: './transmission-list.component.html',
  styleUrl: './transmission-list.component.css'
})
export class TransmissionListComponent {
   transmissions: Transmission[] = [];

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.loadTransmissions();
  }

  loadTransmissions(): void {
    this.vehicleService.getAllTransmissions().subscribe(
      (      data: Transmission[]) => this.transmissions = data,
      (      error: any) => console.error('Error fetching transmissions', error)
    );
  }

  deleteTransmission(id: number): void {
    if (confirm('Are you sure you want to delete this transmission?')) {
      this.vehicleService.deleteTransmission(id).subscribe({
        next: () => {
          this.transmissions = this.transmissions.filter(t => t.id !== id);
          alert('Transmission deleted successfully');
        },
        error: (err: any) => console.error('Error deleting transmission', err)
      });
    }
  }

}
