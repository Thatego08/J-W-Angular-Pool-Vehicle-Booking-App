import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { BookingModel } from '../models/booking.model';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  currentMonth: number;
  currentYear: number;
  daysInMonth!: { date: number; dayOfWeek: number }[];
  events: { [key: number]: BookingModel[] } = {}; // Key is the day of the month
  currentMonthName: string;
  selectedDate: number | null = null; // Track the selected date
  bookingDetails: BookingModel[] = []; // Store details for the selected date

  constructor(private bookingService: BookingService) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.currentMonthName = today.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.loadBookings(() => {
      const today = new Date().getDate();
      this.onDateClick(today); // Automatically select today's date and show its bookings
    });
    this.calculateDaysInMonth();
  }
  
  loadBookings(callback?: () => void) {
    this.bookingService.getBookings().subscribe((bookings: BookingModel[]) => {
      this.events = {}; // Reset events for the new month
      bookings.forEach(booking => {
        const bookingStartDate = new Date(booking.startDate);
        const bookingMonth = bookingStartDate.getMonth();
        const bookingYear = bookingStartDate.getFullYear();
  
        // Check if the booking is in the current month and year
        if (bookingMonth === this.currentMonth && bookingYear === this.currentYear) {
          const date = bookingStartDate.getDate(); // Get the date from the booking
          if (!this.events[date]) {
            this.events[date] = [];
          }
          this.events[date].push(booking); // Store actual BookingModel in the events
        }
      });
  
      // Invoke the callback function if provided
      if (callback) {
        callback();
      }
    });
  }
  
  calculateDaysInMonth() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    this.daysInMonth = []; // Initialize daysInMonth

    for (let date = 1; date <= lastDay.getDate(); date++) {
      const dayOfWeek = new Date(this.currentYear, this.currentMonth, date).getDay();
      this.daysInMonth.push({ date, dayOfWeek });
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11; // December
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.currentMonthName = new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
    this.loadBookings();
    this.calculateDaysInMonth();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0; // January
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.currentMonthName = new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
    this.loadBookings();
    this.calculateDaysInMonth();
  }

  // Method to handle date clicks
  onDateClick(date: number) {
    this.selectedDate = date;

    // Load bookings for the selected date
    this.bookingDetails = this.events[date] ? this.events[date].map(booking => {
      let eventDescription = booking.event;
      if (!eventDescription && booking.projectNumber) {
        eventDescription = `Project: ${booking.projectNumber}`;
      }
      return {
        bookingID: booking.bookingID,
        userName: booking.userName,
        event: eventDescription, // Display either "Project: [project number]" or "No event"
        startDate: booking.startDate,
        endDate: booking.endDate,
        vehicleName: booking.vehicleName,
        projectNumber: booking.projectNumber !== undefined ? booking.projectNumber : undefined // Ensure this is number or undefined
      } as BookingModel; // Cast the result to BookingModel
    }) : []; // If no bookings exist for the selected date, initialize as an empty array
  }
}
