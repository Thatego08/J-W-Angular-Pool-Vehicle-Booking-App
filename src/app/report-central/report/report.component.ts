import { Component, OnInit } from '@angular/core';
import {
  VehicleReport,
  BookingTypeReport,
  TripReport,
  BookingStatusReport,
  ProjectReport,
  ReportService,
  VehicleMakeReport,
  VehicleFuelReport,
  UserTripReportDto,
  BookingsPerUserReport,
  CancelledBookingsReport,
  TripDurationReport
} from '../../services/report.service';
import { TripService } from '../../services/trip.service';
import { BookingService } from '../../services/booking.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { AuthService } from '../../user/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe]
})
export class ReportComponent implements OnInit {
  vehicleMakeReport: VehicleMakeReport[] = [];
  vehicleStatusReport: VehicleReport[] = [];
  bookingTypeReport: BookingTypeReport[] = [];
  tripReport: TripReport[] = [];
  bookingStatusReport: BookingStatusReport[] = [];
  projectStatusReport: ProjectReport[] = [];
  fuelExpenditureReport: VehicleFuelReport[] = [];

  bookingPerUserReport: BookingsPerUserReport[] = [];
  cancelledBookingsReport: CancelledBookingsReport[] = [];
  userTripReport: UserTripReportDto[] = [];
  tripDurationReport: TripDurationReport[] = [];

  filteredUserTripReport: UserTripReportDto[] = [];
  filteredUserBookingReport: BookingsPerUserReport[] = [];

  monthFilter: string = '';
  months = [
    { name: 'January', value: 'January' },
    { name: 'February', value: 'February' },
    { name: 'March', value: 'March' },
    { name: 'April', value: 'April' },
    { name: 'May', value: 'May' },
    { name: 'June', value: 'June' },
    { name: 'July', value: 'July' },
    { name: 'August', value: 'August' },
    { name: 'September', value: 'September' },
    { name: 'October', value: 'October' },
    { name: 'November', value: 'November' },
    { name: 'December', value: 'December' }
  ];

  totalTrips: number = 0;
  totalVehicleStatus: number = 0;
  totalBookingType: number = 0;
  totalBookingStatus: number = 0;
  totalProjectStatus: number = 0;
  totalVehicleMake: number = 0;
  totalFuelExpenditure: number = 0;
  totalFuelCost: number = 0;
  totalCancelledBookings: number = 0;

  currentDate: string = format(new Date(), 'yyyy-MM-dd');
  visibleReports: string[] = [];
  user: any = {};
  companyLogoUrl = 'assets/logo.png';
  usernameFilter: string = '';

  constructor(
    private reportService: ReportService,
    private tripService: TripService,
    private bookingService: BookingService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadReports();
    this.loadTripDurationReport();
  }

  loadUserProfile(): void {
    this.authService.getProfile().subscribe(
      (data: any) => this.user = data,
      error => console.error('Error fetching profile', error)
    );
  }

  loadReports(): void {
    this.reportService.getVehicleStatusReport().subscribe(data => {
      this.vehicleStatusReport = data;
      this.totalVehicleStatus = this.calculateTotal(this.vehicleStatusReport, 'count');
    });

    this.reportService.getVehicleMakeReport().subscribe(data => {
      this.vehicleMakeReport = data;
      this.totalVehicleMake = this.calculateTotal(this.vehicleMakeReport, 'count');
    });

    this.reportService.getBookingTypeReport().subscribe(data => {
      this.bookingTypeReport = data;
      this.totalBookingType = this.calculateTotal(this.bookingTypeReport, 'count');
    });

    this.reportService.getTripReport().subscribe(data => {
      this.tripReport = data;
      this.totalTrips = this.calculateTotal(this.tripReport, 'count');
    });

    this.reportService.getBookingStatusReport().subscribe(data => {
      this.bookingStatusReport = data;
      this.totalBookingStatus = this.calculateTotal(this.bookingStatusReport, 'count');
    });

    this.reportService.getProjectStatusReport().subscribe(data => {
      this.projectStatusReport = data;
      this.totalProjectStatus = this.calculateTotal(this.projectStatusReport, 'count');
    });

    this.reportService.getVehicleFuelReport().subscribe(data => {
      this.fuelExpenditureReport = data;
      this.totalFuelCost = this.calculateTotal(this.fuelExpenditureReport, 'fuelCost');
    });

    this.reportService.getTripsPerUserPerMonth().subscribe(data => {
      this.userTripReport = data;
      this.filteredUserTripReport = data;
    });

    this.reportService.getBookingsPerUserPerMonth().subscribe(data => {
      this.bookingPerUserReport = data;
      this.filteredUserBookingReport = data;
    });

    this.reportService.getCancelledBookingsPerMonth().subscribe(data => {
      this.cancelledBookingsReport = data;
      this.totalCancelledBookings = this.cancelledBookingsReport.length;
    });
  }

  loadTripDurationReport(): void {
    this.reportService.getTripDurationReport().subscribe(
      data => {
        this.tripDurationReport = data;
        console.log('Trip Duration Report Data:', data);
      },
      error => console.error('Error loading trip duration report', error)
    );
  }

  filterUserBookings(): void {
    this.filteredUserBookingReport = this.bookingPerUserReport.filter(booking =>
      booking.userName.toLowerCase().includes(this.usernameFilter.toLowerCase()) &&
      (!this.monthFilter || booking.month === this.monthFilter)
    );
  }

  filterUserTrips(): void {
    this.filteredUserTripReport = this.userTripReport.filter(trip =>
      trip.userName.toLowerCase().includes(this.usernameFilter.toLowerCase()) &&
      (!this.monthFilter || trip.month === this.monthFilter)
    );
  }

   formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Format: e.g. "19 June 2025 14:30"
    return this.datePipe.transform(date, 'dd MMMM yyyy HH:mm') || '';
  }

  private calculateTotal(data: any[], key: string): number {
    return data.reduce((total, item) => total + (item[key] || 0), 0);
  }

  toggleReport(reportId: string): void {
    const index = this.visibleReports.indexOf(reportId);
    if (index === -1) {
      this.visibleReports.push(reportId);
    } else {
      this.visibleReports.splice(index, 1);
    }
  }

  exportTripDurationToExcel(): void {
    if (!this.tripDurationReport || this.tripDurationReport.length === 0) {
      alert('No trip duration data to export!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(this.tripDurationReport.map(trip => ({
       'Trip ID': trip.tripId,
    'Vehicle Name': trip.vehicleName,
    'Location': trip.location,
    'Booking Start Time & Date': this.formatDate(trip.bookingStart),
    'Booking End Time & Date': this.formatDate(trip.bookingEnd),
    'Travel Start Time & Date': this.formatDate(trip.travelStart),
    'Travel End Time & Date': this.formatDate(trip.travelEnd),
    'Earliest Start': this.formatDate(trip.earliestStart),
    'Duration': trip.duration ?? '',
    'Opening Kms': trip.openingKms ?? '',
    'Closing Kms': trip.closingKms ?? '',
    'Travelled Kms': trip.travelledKms ?? ''
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trip Duration Report');
    XLSX.writeFile(workbook, 'TripDurationReport.xlsx');
  }

  exportToPdf(): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const logo = new Image();
    logo.src = this.companyLogoUrl;
    logo.onload = () => {
      pdf.addImage(logo, 'PNG', 10, 10, 50, 20);
      pdf.setFontSize(16);
      pdf.text('J&W System Reports', 10, 40);
      pdf.setFontSize(12);
      pdf.text(`Generated by: ${this.user.name} ${this.user.surname}`, 10, 50);
      pdf.text(`Date Generated: ${new Date().toLocaleDateString()}`, 10, 60);

      // Example: Add table or text here for report details, e.g.:
      // pdf.autoTable({ head: [['Column1', 'Column2']], body: [ ['Data1', 'Data2'] ], startY: 70 });

      pdf.save('J&W Reports.pdf');
    };
  }
}
