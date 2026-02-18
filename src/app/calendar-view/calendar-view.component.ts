import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { BookingModel } from '../models/booking.model';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/vehicle.model';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  currentMonth: number;
  currentYear: number;
  currentMonthName: string;

  //Vehicle Data
  vehicles: Vehicle[] = [];

  filteredVehicles: Vehicle[] = [];

  // All bookings (filtered once, excludes cancelled)
  allBookings: BookingModel[] = [];

  // Calendar grid: 42 cells (6 weeks × 7 days). date = null for empty cells.
  calendarDays: { date: number | null; dayOfWeek: number }[] = [];

  // Lookup: date (day of month) -> list of bookings on that day
  events: { [key: number]: BookingModel[] } = {};

  selectedDate: number | null = null;
  bookingDetails: BookingModel[] = [];

  constructor(private bookingService: BookingService, private vehicleService: VehicleService) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.currentMonthName = today.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadBookings(() => {
      const today = new Date().getDate();
      this.onDateClick(today); // auto‑select today
    });
  }

  /**
   * Load bookings, filter out cancelled, and build the events object
   * for multi‑day display.
   */
  loadBookings(callback?: () => void): void {
    this.bookingService.getBookings().subscribe((bookings: BookingModel[]) => {
      // Exclude cancelled bookings (statusId === 4)
      this.allBookings = bookings.filter(b => b.statusId !== 4);
      this.buildEvents();
      this.calculateDaysInMonth(); // rebuild grid (calls buildEvents again? We'll separate)
      if (callback) callback();
    });
  }

  // Add a property to store vehicle map
private vehicleMap: Map<string, string> = new Map(); // key: vehicleName, value: registration

 loadVehicles(): void {
  this.vehicleService.getAllVehicles().subscribe(
    (data: Vehicle[]) => {
      this.vehicles = data;
      // Build a map for quick lookup by vehicle name (adjust key if needed)
      this.vehicleMap = new Map(data.map(v => [v.name, v.registrationNumber]));
      // After vehicles loaded, rebuild events to include registration
      this.buildEvents();
    },
    (error) => console.error('Error fetching vehicles:', error)
  );
}


  /**
   * Build the events object: for each booking, add it to EVERY day
   * from startDate to endDate (inclusive) that falls in the current month/year.
   */
  buildEvents(): void {
    this.events = {};

    this.allBookings.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      // Iterate day by day
      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        const year = day.getFullYear();
        const month = day.getMonth();
        const date = day.getDate();

        // Only include days belonging to the currently displayed month/year
        if (year === this.currentYear && month === this.currentMonth) {
          if (!this.events[date]) {
            this.events[date] = [];
          }
          this.events[date].push(booking);
        }
      }
    });
  }

  /**
   * Build the 42‑cell calendar grid, correctly offsetting empty cells
   * before the first day of the month.
   */
  calculateDaysInMonth(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();

    this.calendarDays = [];

    // Empty cells before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      this.calendarDays.push({ date: null, dayOfWeek: i });
    }

    // Actual days of the month
    for (let date = 1; date <= totalDays; date++) {
      const dayOfWeek = new Date(this.currentYear, this.currentMonth, date).getDay();
      this.calendarDays.push({ date, dayOfWeek });
    }

    // Fill remaining cells to always have 42 (6 rows × 7 columns)
    const totalCells = 42;
    const remaining = totalCells - this.calendarDays.length;
    for (let i = 0; i < remaining; i++) {
      this.calendarDays.push({ date: null, dayOfWeek: (startDayOfWeek + totalDays + i) % 7 });
    }
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateMonthView();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateMonthView();
  }

  /**
   * Common tasks after changing month/year:
   * - update month name
   * - rebuild calendar grid
   * - rebuild events for the new month
   * - clear selection or keep it (here we clear)
   */
  private updateMonthView(): void {
    this.currentMonthName = new Date(this.currentYear, this.currentMonth)
      .toLocaleString('default', { month: 'long' });
    this.calculateDaysInMonth();
    this.buildEvents();
    this.selectedDate = null;
    this.bookingDetails = [];
  }

  /**
   * Handle click on a day cell.
   * Show all bookings that cover this date (start ≤ date ≤ end).
   */
  onDateClick(date: number): void {
    this.selectedDate = date;
    const selectedDay = new Date(this.currentYear, this.currentMonth, date);

    this.bookingDetails = this.allBookings.filter(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return selectedDay >= start && selectedDay <= end;
    }).map(booking => ({
      ...booking,
      // Provide a readable event/project display
      event: booking.event || (booking.projectNumber ? `Project: ${booking.projectNumber}` : 'No event')
    }));
  }
}