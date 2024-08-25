import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingModel } from '../../models/booking.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditBookingComponent } from '../edit-booking/edit-booking.component';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit{
  page: number = 1; // Default page number

  bookings: BookingModel[] = [];
  selectedBooking: BookingModel | null = null;
  modalRef: NgbModalRef | null = null; // Initialize modalRef to null

  constructor(private bookingService: BookingService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (data: BookingModel[]) => {
        console.log('Bookings data:', data); // Check the data received
        this.bookings = data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
     },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }


  openEditModal(booking: BookingModel): void {
    this.selectedBooking = booking;
    this.modalRef = this.modalService.open(EditBookingComponent, { size: 'lg' }); // Assign modalRef here
    if (this.modalRef) {
      this.modalRef.componentInstance.booking = booking;
      this.modalRef.componentInstance.close.subscribe(() => {
        this.modalRef?.close();
        this.loadBookings(); // Refresh bookings after modal closes
      });
    }
  }

  closeEditModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss(); // Dismiss the modal if open
    }
    this.selectedBooking = null;
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(id).subscribe(
        () => {
          alert('Booking has been successfully deleted!');
          // Refresh the booking list or handle the UI update
        },
        (error) => {
          console.error('Error deleting booking:', error);
          alert('There was an error deleting the booking. Please try again.');
        }
      );
    }
  }

  cancelBooking(booking: BookingModel): void {
    if (confirm(`Are you sure you want to cancel the booking for ${booking.userName}?`)) {
      this.bookingService.cancelBooking(booking.bookingID).subscribe({
        next: (response) => {
          alert( 'Booking has been successfully canceled!');
          this.loadBookings(); // Refresh the booking list after cancellation
        },
        error: (error) => {
          console.error('Error canceling booking:', error);
          alert('There was an error canceling the booking. Please try again.');
        }
      });
    }
  }
}
