import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TripModel } from '../trip.model';
import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {

  trip: TripModel = {
    tripId: 0,
    vehicleId: 0,
    location: '',
    fuelAmount: 0,
    comment: '',
    travelStart: new Date(),
    travelEnd: new Date(),
    registrationNumber: '',

    userName: '',
    MediaFiles: undefined
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const tripId = +id;
        console.log(`Fetching trip with ID: ${tripId}`);
        this.tripService.getTripById(tripId).subscribe({
          next: (response) => {
            this.trip = response;
            console.log(`Trip fetched: `, response);
          },
          error: (error) => {
            this.errorMessage = `Error fetching trip details: ${error.message}`;
            console.error('Error fetching trip:', error);
          }
        });
      }
    });
  }

  updateTrip(form: NgForm) {
    if (form.valid) {
      this.tripService.updateTrip(this.trip.tripId, this.trip).subscribe({
        next: (response) => {
          this.successMessage = 'Trip updated successfully';
          setTimeout(() => {
            this.router.navigate(['/get-trips']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = `Error updating trip: ${error.error}`;
          console.error('Error updating trip', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/get-trips']);
  }
}
