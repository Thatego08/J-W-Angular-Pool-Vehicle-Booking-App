// src/app/components/booking-history/booking-history.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private bookingService: BookingService) {}

  searchBookingHistory() {
    if (this.searchUsername) {
      this.bookingService.searchBookingHistory(this.searchUsername)
        .subscribe(response => {
          console.log('API Response:', response);
          this.bookings = response.length > 0 ? response : [];
        }, error => {
          console.error('Error fetching booking history', error);
          this.bookings = [];
        });
    }
  }
}
