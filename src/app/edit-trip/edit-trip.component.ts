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
    name: '',
    location: '',
   
    comment: '',
    travelStart: new Date(),
    travelEnd: new Date(),
   

    userName: '',
  
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
        console.log('Trip data being sent:', this.trip); // Log the data
        this.tripService.updateTrip(this.trip.tripId, this.trip).subscribe({
            next: (response) => {
                this.successMessage = 'Trip updated successfully';
                setTimeout(() => {
                    this.router.navigate(['/get-trip']);
                }, 2000);
            },
            error: (error) => {
                console.error('Error updating trip:', error);
                this.errorMessage = `Error updating trip: ${error.error?.message || error.message}`;
                if (error.error?.errors) {
                    this.errorMessage += ': ' + Object.values(error.error.errors).flat().join(', ');
                }
            }
        });
    } else {
        this.errorMessage = 'Form is invalid.';
    }
}
}