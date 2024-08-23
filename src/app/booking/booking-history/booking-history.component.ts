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

  initiatePreChecklist(bookingID: number) {
    this.router.navigate(['/pre-checklist'], { queryParams: { bookingId: bookingID } });
  }
}