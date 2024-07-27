import { Component, OnInit } from '@angular/core';
import { TripService } from '../services/trip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  trips: any[] = [];
  message: string = '';
  searchedTrip: any = null;
  userName: string = '';


  constructor(private router: Router, private tripService: TripService) {}

  ngOnInit(): void {
    this.fetchTrips();
  }

  fetchTrips() {
    this.tripService.getAllTrips().subscribe(
      (data: any[]) => {
        this.trips = data;
      },
      error => {
        console.error('Error fetching trips', error);
      }
    );
  }

  deleteTrip(tripId: number) {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.tripService.deleteTrip(tripId).subscribe(
        () => {
          // Remove deleted trip from local list
          this.trips = this.trips.filter(t => t.tripId !== tripId);
          // Clear searched trip when deleted
          if (this.searchedTrip && this.searchedTrip.tripId === tripId) {
            this.searchedTrip = null;
          }
        },
        error => {
          console.error('Error deleting trip', error);
        }
      );
    }
  }

  editTrip(tripId: number): void {
    this.router.navigate(['/edit-trip', tripId]); // Navigate to edit trip component with tripId as parameter
}
  fetchTripDetails(tripId: number): void {
    this.tripService.getTripById(tripId).subscribe(
      (data: any) => {
        this.searchedTrip = data; // Assign the fetched trip to searchedTrip
        console.log('Fetched trip details:', this.searchedTrip);
      },
      error => {
        console.error('Error fetching trip details', error);
        // Handle error as needed, e.g., show a message to the user
      }
    );
  }
  

  
}
