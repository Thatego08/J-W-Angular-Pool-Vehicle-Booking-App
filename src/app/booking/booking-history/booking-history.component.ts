import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingModel } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent {
  searchUsername: string = '';
  bookings: BookingModel[] = [];

  constructor(private bookingService: BookingService, private router: Router) {}

  searchBookingHistory() {
    if (this.searchUsername) {
      this.bookingService.searchBookingHistory(this.searchUsername)
        .subscribe(response => {
          this.bookings = response.length > 0 ? response : [];
        }, error => {
          console.error('Error fetching booking history', error);
          this.bookings = [];
        });
    }
  }

  initiateTrip(booking: BookingModel) {
    // Ensure startDate and endDate are valid Date objects
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
  
    // Format the dates for datetime-local input or URL
    const formattedStartDate = startDate.toISOString().slice(0, 16); // Format: yyyy-MM-ddTHH:mm
    const formattedEndDate = endDate.toISOString().slice(0, 16); // Format: yyyy-MM-ddTHH:mm
  
    this.router.navigate(['/create-trip'], {
      queryParams: {
        bookingId: booking.bookingID,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        vehicleName: booking.vehicleName // Pass vehicleName
      }
    });

 
  }
}
