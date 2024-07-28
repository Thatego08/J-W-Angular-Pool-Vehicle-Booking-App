import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Colour } from '../../models/colour.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-colour',
  templateUrl: './colour.component.html',
  styleUrls: ['./colour.component.css']
})
export class ColourComponent implements OnInit {
  colours: Colour[] = [];

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadColours();
  }

  loadColours(): void {
    this.vehicleService.getAllColours().subscribe({
      next: (colours) => {
        this.colours = colours;
      },
      error: (error) => {
        console.error('Error fetching colours:', error);
      }
    });
  }

  deleteColour(colourId: number): void {
    if (confirm('Are you sure you want to delete this colour?')) {
      this.vehicleService.deleteColour(colourId).subscribe(
        () => {
          alert('Coolour deleted successfully.');
          // Optionally, refresh the list or handle the UI update here
        },
        error => {
          alert('Failed to delete the colour.');
          console.error('Delete failed', error);
        }
      );
    }}

  navigateToEditColour(colourId: number): void {
    this.router.navigate(['/edit-colour', colourId]);
  }
}
