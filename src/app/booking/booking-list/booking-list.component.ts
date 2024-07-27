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

  bookings: BookingModel[] = [];
  selectedBooking: BookingModel | null = null;
  modalRef: NgbModalRef | null = null; // Initialize modalRef to null

  constructor(private bookingService: BookingService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe((data: BookingModel[]) => {
      console.log(data); // Add this line to check the received data
      this.bookings = data;
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

  deleteBooking(bookingID: number): void {
    this.bookingService.deleteBooking(bookingID).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.bookingID !== bookingID);
      },
      error: (error) => {
        console.error('Error deleting booking:', error);
      }
    });
  }
}
