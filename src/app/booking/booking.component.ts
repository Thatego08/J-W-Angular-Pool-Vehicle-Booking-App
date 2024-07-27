import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { BookingModel } from '../models/booking.model';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit{

  bookings: BookingModel[] = [];

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe(data => {
      this.bookings = data;
    });
  }
}
