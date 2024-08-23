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
          this.trips = this.trips.filter(t => t.tripId !== tripId);
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
    this.router.navigate(['/edit-trip', tripId]);
  }

  fetchTripDetails(tripId: number): void {
    this.tripService.getTripById(tripId).subscribe(
      (data: any) => {
        this.searchedTrip = data;
        console.log('Fetched trip details:', this.searchedTrip);
      },
      error => {
        console.error('Error fetching trip details', error);
      }
    );
  }

  convertToXML(data: any[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Trips>';
    data.forEach(trip => {
      xml += `<Trip>
        <TripId>${trip.tripId}</TripId>
        <VehicleName>${trip.name}</VehicleName>
        <Location>${trip.location}</Location>
        <Comment>${trip.comment}</Comment>
        <TravelStart>${trip.travelStart}</TravelStart>
        <TravelEnd>${trip.travelEnd}</TravelEnd>
        <BookingID>${trip.bookingID}</BookingID>
        <ChecklistID>${trip.preChecklist?.id}</ChecklistID>
      </Trip>`;
    });
    xml += '</Trips>';
    return xml;
  }

  downloadXML() {
    const xml = this.convertToXML(this.trips);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trips.xml';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
