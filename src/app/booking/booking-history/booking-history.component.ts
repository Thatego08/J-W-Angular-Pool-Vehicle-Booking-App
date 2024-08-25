import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingModel } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../user/auth.service';
@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  searchUsername: string = '';
  bookings: BookingModel[] = [];
  user: any; // Variable to store the logged-in user data
  page: number = 1; // Default page number

  constructor(
    private bookingService: BookingService,
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
        this.searchUsername = this.user.userName; // Automatically set searchUsername to logged-in user's username
        this.searchBookingHistory(); // Automatically fetch bookings for logged-in user
      },
      (error) => {
        console.error('Error fetching profile', error);
        // Optionally handle error (e.g., redirect to login if unauthorized)
      }
    );
  }

  searchBookingHistory() {
    if (this.searchUsername) {
      this.bookingService.searchBookingHistory(this.searchUsername)
        .subscribe(response => {
          this.bookings = response.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        }, error => {
          console.error('Error fetching booking history', error);
          this.bookings = [];
        });
    }
  }

  initiatePreChecklist(bookingID: number) {
    this.router.navigate(['/pre-checklist'], { queryParams: { bookingId: bookingID } });
  }

  isEndDatePassed(endDate: Date): boolean {
    const currentDate = new Date();
    return new Date(endDate) < currentDate;
  }
}
