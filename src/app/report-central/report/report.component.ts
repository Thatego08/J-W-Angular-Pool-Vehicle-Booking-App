import { Component, OnInit } from '@angular/core';
import { VehicleReport, BookingTypeReport, TripReport, BookingStatusReport, ProjectReport, ReportService, VehicleMakeReport, VehicleFuelReport, UserTripReportDto, BookingsPerUserReport, CancelledBookingsReport } from '../../services/report.service';
import { TripService } from '../../services/trip.service';
import { BookingService } from '../../services/booking.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { AuthService } from '../../user/auth.service';
import { DatePipe } from '@angular/common';
import 'jspdf-autotable';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe] //include DatePipe as a provider
})

export class ReportComponent implements OnInit {
  vehicleMakeReport: VehicleMakeReport[] = [];
  vehicleStatusReport: VehicleReport[] = [];
  bookingTypeReport: BookingTypeReport[] = [];
  tripReport: TripReport[] = [];
  bookingStatusReport: BookingStatusReport[] = [];
  projectStatusReport: ProjectReport[] = [];
  fuelExpenditureReport: VehicleFuelReport[] = [];

  bookingPerUserReport: BookingsPerUserReport[] = []; // New property for bookings per user per month
  cancelledBookingsReport: CancelledBookingsReport[] = []; // New property

  userTripReport: UserTripReportDto[] = []; // New property for user trip report
 
  filteredUserTripReport: UserTripReportDto[] = []; // New property for filtered user trip report
  filteredUserBookingReport: BookingsPerUserReport[] = []; // Update if necessary

  monthFilter: string = ''; // New property for month filter
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
  totalCancelledBookings: number = 0; // Total cancelled bookings

  currentDate: string = format(new Date(), 'yyyy-MM-dd');
  visibleReports: string[] = [];
  user: any = {};
  companyLogoUrl = 'assets/logo.png';
  usernameFilter: string = ''; // New property for username filter

  constructor(
    private reportService: ReportService,
    private tripService: TripService,
    private bookingService: BookingService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadReports();
    this.loadUserProfile();
  }


  loadUserProfile(): void {
    this.authService.getProfile().subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {
        console.log('Error fetching profile', error);
      }
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

    // Load user trips per month
    this.reportService.getTripsPerUserPerMonth().subscribe((data) => {
      this.userTripReport = data;
      this.filteredUserTripReport = data; // Initialize filtered trips
    });


   // Load bookings per user per month report
  this.reportService.getBookingsPerUserPerMonth().subscribe(data => {
    this.bookingPerUserReport = data;
    this.filteredUserBookingReport = data; // Initialize filtered user booking report
  });

    // Load cancelled bookings per month
    this.reportService.getCancelledBookingsPerMonth().subscribe(data => {
      this.cancelledBookingsReport = data;
      this.totalCancelledBookings = this.cancelledBookingsReport.length;
  });

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
// Helper function to format dates as DD/MM/YYYY
formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'long', year: 'numeric' } as const;
  return date.toLocaleDateString('en-GB', options); // Use 'en-GB' for DD/MM/YYYY format
}



  private calculateTotal(data: any[], key: string): number {
    return data.reduce((total, item) => total + (item[key] || 0), 0);
  }

  toggleReport(reportId: string): void {
    const index = this.visibleReports.indexOf(reportId);
    if (index === -1) {
      this.visibleReports.push(reportId); // Show the report
    } else {
      this.visibleReports.splice(index, 1); // Hide the report
    }
  }

  exportToPdf(): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
  
    // Add Company Logo
    const logo = new Image();
    logo.src = this.companyLogoUrl;
    pdf.addImage(logo, 'PNG', 10, 10, 50, 20); // Adjust the size and position
  
    // Add Title and Date
    pdf.setFontSize(16);
    pdf.text('J&W System Reports', 10, 40); // Adjust title position
    pdf.setFontSize(12);
    pdf.text(`Generated by: ${this.user.name} ${this.user.surname}`, 10, 50); // Generated by
    pdf.text(`Date Generated: ${new Date().toLocaleDateString()}`, 10, 60); // Generated date
  
    let yOffset = 70; // Y-offset for keeping track of content placement
  
    // Vehicle Make Report (always export)
    pdf.setFontSize(14);
    pdf.text('Vehicle Make Report', 10, yOffset);
    yOffset += 10;
  
    const vehicleMakeRows = this.vehicleMakeReport.map((report: any) => [
      report.make,
      report.count
    ]);
  
    (pdf as any).autoTable({
      head: [['Make', 'Count']],
      body: vehicleMakeRows,
      startY: yOffset
    });
  
    yOffset = (pdf as any).lastAutoTable.finalY + 10;
    pdf.text(`Total Vehicle Makes: ${this.totalVehicleMake}`, 10, yOffset);
    yOffset += 10;
  
    // Fuel Expenditure Report (always export)
    pdf.setFontSize(14);
    yOffset += 20;
    pdf.text('Fuel Expenditure Report', 10, yOffset);
    yOffset += 10;
  
    const fuelExpenditureRows = this.fuelExpenditureReport.map((report: any) => [
      report.vehicleName,
      report.tripDate,
      report.fuelAmount,
      report.fuelCost
    ]);
  
    (pdf as any).autoTable({
      head: [['Vehicle Name', 'Trip Date', 'Fuel Amount (Litres)', 'Fuel Cost (Rands)']],
      body: fuelExpenditureRows,
      startY: yOffset
    });
  
    yOffset = (pdf as any).lastAutoTable.finalY + 10;
    pdf.text(`Total Fuel Cost: R${this.totalFuelCost.toFixed(2)}`, 10, yOffset);
    yOffset += 10;
  
    // Booking per User per Month Report (new section)
    pdf.setFontSize(14);
    yOffset += 20;
    pdf.text('Booking per User per Month Report', 10, yOffset);
    yOffset += 10;
  
    const bookingUserRows = this.filteredUserBookingReport.map((report: any) => [
      report.userName,
      report.month,
      report.year,
      report.bookingCount
    ]);
  
    (pdf as any).autoTable({
      head: [['Username', 'Month', 'Year', 'Total Bookings']],
      body: bookingUserRows,
      startY: yOffset
    });
  
    yOffset = (pdf as any).lastAutoTable.finalY + 10;
  
    // Cancelled Bookings Report (new section)
    pdf.setFontSize(14);
    yOffset += 20;
    pdf.text('Cancelled Bookings per Month Report', 10, yOffset);
    yOffset += 10;
 
  
    const cancelledBookingRows = this.cancelledBookingsReport.map((report: any) => [
      report.userName,
      report.bookingId,
      this.formatDate(report.endDate),
      
    ]);
  
    (pdf as any).autoTable({
      head: [['Username', 'Booking ID', 'Cancelled Date']],
      body: cancelledBookingRows,
      startY: yOffset
    });
  
    yOffset = (pdf as any).lastAutoTable.finalY + 10;
  
    // Trip Report (new section)
    pdf.setFontSize(14);
    yOffset += 20;
    pdf.text('User Trip Report', 10, yOffset);
    yOffset += 10;
  
    const tripRows = this.filteredUserTripReport.map((report: any) => [
      report.userName,
      report.month,
      report.year,
      report.tripCount
    ]);
  
    (pdf as any).autoTable({
      head: [['Username', 'Month', 'Year', 'Trip Count']],
      body: tripRows,
      startY: yOffset
    });
  
    yOffset = (pdf as any).lastAutoTable.finalY + 10;
  
    // Save the PDF
    pdf.save('J&W Reports.pdf');
    
  }
  
}
