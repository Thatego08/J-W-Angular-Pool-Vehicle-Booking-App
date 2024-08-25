import { Component, OnInit } from '@angular/core';
import { TripService } from '../services/trip.service';
import { TripModel } from '../trip.model';
import { Router } from '@angular/router';
import { AuthService } from '../user/auth.service';

@Component({
  selector: 'app-get-trip',
  templateUrl: './get-trip.component.html',
  styleUrls: ['./get-trip.component.css']
})
export class GetTripComponent implements OnInit {
  searchUsername: string = ''; // Variable to store the username for searching trips
  previousTrips: TripModel[] = [];
  user: any = {}; // Variable to store the logged-in user data

  constructor(
    private tripService: TripService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile(); // Load logged-in user data when component initializes
  }

  loadUserProfile(): void {
    this.authService.getProfile().subscribe(
      (data: any) => {
        this.user = data;
        this.searchUsername = this.user.userName; // Pre-populate search bar with logged-in user's username
        this.fetchPreviousTrips(); // Automatically fetch trips for logged-in user
      },
      (error) => {
        console.error('Error fetching profile', error);
        // Optionally handle error (e.g., redirect to login if unauthorized)
      }
    );
  }

  fetchPreviousTrips() {
    if (!this.searchUsername) {
      console.error('Username is required');
      return;
    }

    this.tripService.getPreviousTripsByUserName(this.searchUsername).subscribe(
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

  navigateToCreatePostChecklist() {
    this.router.navigate(['/create-post-check']); // Navigate to create-post-checklist route
  }

  deleteTrip(tripId: number) {
    const confirmation = confirm('Are you sure you want to delete this trip?');
    if (confirmation) {
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

  navigateToRefuel(tripId: number) {
    this.router.navigate(['/refuel-vehicle', tripId]); // Navigate to refuel-vehicle route with tripId
  }

  isTravelEndPassed(travelEnd: Date): boolean {
    const currentDate = new Date();
    return new Date(travelEnd) < currentDate;
  }
}
