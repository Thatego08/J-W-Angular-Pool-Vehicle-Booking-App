import { Component, OnInit } from '@angular/core';
import { TripService } from '../services/trip.service';
import { TripModel } from '../trip.model';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-get-trip',
  templateUrl: './get-trip.component.html',
  styleUrls: ['./get-trip.component.css']
})
export class GetTripComponent implements OnInit {
  previousTrips: TripModel[] = [];
  userName: string = '';

  constructor(private tripService: TripService, private router: Router) {}

  ngOnInit(): void {}

  fetchPreviousTrips() {
    if (this.userName.trim() === '') {
      console.error('Username is required');
      return;
    }

    this.tripService.getPreviousTripsByUserName(this.userName).subscribe(
      (data: TripModel[]) => {
        console.log('Fetched trips:', data);
        this.previousTrips = data;
      },
      error => {
        console.error('Error fetching previous trips', error);
        this.previousTrips = [];
      }
    );
  }
  editTrip(trip: TripModel) {
    this.router.navigate(['/edit-trip', trip.tripId]); // Navigate to edit-trip route with tripId
  }

  deleteTrip(tripId: number) {
    this.tripService.deleteTrip(tripId).subscribe(
      () => {
        console.log('Deleted trip with ID:', tripId);
        this.previousTrips = this.previousTrips.filter(trip => trip.tripId !== tripId);
      },
      error => {
        console.error('Error deleting trip', error);
      }
    );
  }
}