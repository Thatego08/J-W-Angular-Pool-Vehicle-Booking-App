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
  filteredTripDurationReport: TripDurationReport[] = [];

  filteredUserTripReport: UserTripReportDto[] = [];
  filteredUserBookingReport: BookingsPerUserReport[] = [];

  monthFilter: string = '';
  tripMonthFilter: string = '';
  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
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
        this.filteredTripDurationReport = data;
        this.filterTripDurationReport(); // Filter on load if month is selected
      },
      error => console.error('Error loading trip duration report', error)
    );
  }

  filterTripDurationReport(): void {
    if (!this.tripMonthFilter) {
      this.filteredTripDurationReport = [...this.tripDurationReport];
    } else {
      this.filteredTripDurationReport = this.tripDurationReport.filter(report => {
        if (report.earliestStart) {
          const month = new Date(report.earliestStart).toISOString().slice(5, 7);
          return month === this.tripMonthFilter;
        }
        return false;
      });
    }
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
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm') || '';
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
  if (!this.filteredTripDurationReport || this.filteredTripDurationReport.length === 0) {
    alert('No trip duration data to export!');
    return;
  }

  const header = [
    'Trip ID',
    'Vehicle Name',
    'Location',
    'Project Number',
    'Booking Start Time & Date',
    'Booking End Time & Date',
    'Travel Start Time & Date',
    'Travel End Time & Date',
    'Earliest Start',
    'Use Duration',
    'Opening Kms',
    'Closing Kms',
    'Travelled Kms'
  ];

  const data = this.filteredTripDurationReport.map(trip => [
    trip.tripId,
    trip.vehicleName,
    trip.location,
    trip.projectNumber ?? '',
    this.formatDate(trip.bookingStart),
    this.formatDate(trip.bookingEnd),
    this.formatDate(trip.travelStart),
    this.formatDate(trip.travelEnd),
    this.formatDate(trip.earliestStart),
   this.calculateDays(trip.travelStart, trip.travelEnd),

    trip.openingKms ?? '',
    trip.closingKms ?? '',
    trip.closingKms && trip.openingKms ? (trip.closingKms - trip.openingKms) : ''
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Trip Duration Report');
  XLSX.writeFile(workbook, 'TripDurationReport.xlsx');
}


  formatDurationDays(duration: string | null): string {
    if (!duration) return '-';
    const parts = duration.split(':'); // Expecting format "hh:mm:ss"
    if (parts.length !== 3) return duration;
    const hours = parseInt(parts[0], 10);
    const days = Math.floor(hours / 24);
    return days === 1 ? '' : `${days} `;
  }

  calculateDays(start: string | Date, end: string | Date): string {
  if (!start || !end) return '-';
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Round down both dates to midnight to ignore time component
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffInMs = endDate.getTime() - startDate.getTime();

  if (diffInMs < 0) return '-'; // Optional: handle invalid ranges

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

  return `${diffInDays}`;
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
      pdf.save('J&W Reports.pdf');
    };
  }
}
