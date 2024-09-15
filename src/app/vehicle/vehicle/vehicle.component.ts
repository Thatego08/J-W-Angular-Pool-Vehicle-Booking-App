
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Router } from '@angular/router';
import { Colour } from '../../models/colour.model';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleFuelType } from '../../models/fuel.model';
import { InsuranceCover } from '../../models/insurance.model';
import { VehicleModel } from '../../models/vehicle-model.model';
import { AddVehicleComponent } from '../add-vehicle/add-vehicle.component';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  page: number = 1; // Default page number
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  searchQuery: string = '';
  selectedMakeId: number | null = null;
  selectedColourId: number | null = null;
  selectedFuelTypeId: number | null = null;
  selectedInsuranceCoverId: number | null = null;

  vehicleMakes: VehicleMake[] = [];
  vehicleModels: VehicleModel[] =[]
  colours: Colour[] = [];
  fuelTypes: VehicleFuelType[] = [];
  insuranceCovers: InsuranceCover[] = [];
  

  constructor(private vehicleService: VehicleService,
     private router: Router,
    private dialog: MatDialog,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadFilters();
  }

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe(
      (data: Vehicle[]) => {
        this.vehicles = data;
        this.filteredVehicles = this.vehicles;
        this.filterVehicles(); // Apply filters on load
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  loadFilters(): void {
    this.vehicleService.getAllVehicleMakes().subscribe((data: VehicleMake[]) => this.vehicleMakes = data);
    this.vehicleService.getAllVehicleModels().subscribe((data: VehicleModel[]) => this.vehicleModels = data);
    this.vehicleService.getAllColours().subscribe((data: Colour[]) => this.colours = data);
    this.vehicleService.getAllFuelTypes().subscribe((data: VehicleFuelType[]) => this.fuelTypes = data);
    this.vehicleService.getAllInsuranceCovers().subscribe((data: InsuranceCover[]) => this.insuranceCovers = data);
  }

  filterVehicles(): void {
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      return (
        (this.selectedMakeId === null || vehicle.vehicleMakeID === this.selectedMakeId) &&
        (this.selectedColourId === null || vehicle.colourID === this.selectedColourId) &&
        (this.selectedFuelTypeId === null || vehicle.fuelTypeID === this.selectedFuelTypeId) &&
        (this.selectedInsuranceCoverId === null || vehicle.insuranceCoverID === this.selectedInsuranceCoverId) &&
        (this.searchQuery === '' || 
          vehicle.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          vehicle.registrationNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          vehicle.vin.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          vehicle.engineNo.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
    });
  }
  //Finalo

  onSearchQueryChange(): void {
    this.filterVehicles();
  }

  onFilterChange(): void {
    this.filterVehicles();
  }

  editVehicle(vehicleID: number): void {
    this.router.navigate(['/edit-vehicle', vehicleID]);
  }

  openAddVehicleModal(): void {
    this.dialog.open(AddVehicleComponent, {
      width: '500px',
      // Other configurations if needed
    });
  }

  deleteVehicle(vehicleID: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicleID).subscribe(() => {
        this.loadVehicles(); // Refresh vehicle list after deletion
      });
    }
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('JWVehicles');

    // Add company logo
    this.http.get('assets/logo.png', { responseType: 'arraybuffer' }).subscribe(imageData => {
      const logoBuffer = new Uint8Array(imageData);
      const imageId = workbook.addImage({
        buffer: logoBuffer,
        extension: 'png',
      });

      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 }, // Top-left corner
        ext: { width: 200, height: 100 }, // Width and height in pixels
      });

      // Insert a blank row below the image
      worksheet.addRow([]); // Row 7 is currently empty due to image

      // Define headers starting from row 8
      const headerRow = worksheet.getRow(7);
      headerRow.values = [
        'Vehicle ID',
        'Name',
        'Registration Number',
        'Description',
        'VIN',
        'Engine No',
        'Date Acquired',
        'Colour',
        'License Expiry Date',
        'Insurance Cover',
        'Fuel Type',
        'Vehicle Make',
        'Vehicle Model',
        'Status'
      ];

      // Apply styling for headers
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C0C0C0' } // Yellow background
      };

      // Define column widths
      worksheet.columns = [
        { width: 5 },
        { width: 10 },
        { width: 30 },
        { width: 30 },
        { width: 20 },
        { width: 20 },
        { width: 15 },
        { width: 15 },
        { width: 20 },
        { width: 20 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 10 }
      ];

      // Add data rows starting from row 8
      this.vehicles.forEach((vehicle, index) => {
        worksheet.addRow([
          vehicle.vehicleID,
          vehicle.name,
          vehicle.registrationNumber,
          vehicle.description,
          vehicle.vin,
          vehicle.engineNo,
          vehicle.dateAcquired ? new Date(vehicle.dateAcquired) : null,
          vehicle.colour?.name || 'N/A',
          vehicle.licenseExpiryDate ? new Date(vehicle.dateAcquired) : null,
          vehicle.insuranceCover?.insuranceCoverName || 'N/A',
          vehicle.fuelType?.fuelName || 'N/A',
          vehicle.vehicleMake?.name || 'N/A',
          vehicle.vehicleModel?.vehicleModelName || 'N/A',
          vehicle.status?.name || 'N/A'
        ]);
      });

       // Format date columns
    worksheet.getColumn(7).numFmt = 'd mmmm yyyy'; // Date Acquired
    worksheet.getColumn(9).numFmt = 'd mmmm yyyy'; // License Expiry Date

      // Add date and time below the vehicle list
      worksheet.addRow([]); // Blank row
      worksheet.addRow([`Date Generated: ${new Date().toLocaleString()}`]);

      // Write file
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), 'JWVehicles.xlsx');
      });
    });
  }

  /*
  exportToWord(): void {
    this.http.get('assets/template.docx', { responseType: 'arraybuffer' }).subscribe(data => {
      const zip = new PizZip(data);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  
      // Prepare data to insert into the template
      const docData = {
        vehicles: this.vehicles.map(vehicle => ({
          VehicleID: vehicle.vehicleID,
          Name: vehicle.name,
          RegistrationNumber: vehicle.registrationNumber,
          DateAcquired: vehicle.dateAcquired ? new Date(vehicle.dateAcquired).toLocaleDateString() : 'N/A',
          LicenseExpiryDate: vehicle.licenseExpiryDate ? new Date(vehicle.licenseExpiryDate).toLocaleDateString() : 'N/A',
          Vin: vehicle.vin,
          EngineNo: vehicle.engineNo,
          Colour: vehicle.colour?.name || 'N/A',
          FuelType: vehicle.fuelType?.fuelName || 'N/A',
          InsuranceCover: vehicle.insuranceCover?.insuranceCoverName || 'N/A',
          VehicleMake: vehicle.vehicleMake?.name || 'N/A',
          VehicleModel: vehicle.vehicleModel?.vehicleModelName || 'N/A',
          Status: vehicle.status?.name || 'N/A',
        }))
      };
  
      // Set the templateVariables
      doc.render(docData);
  
      // Generate the document
      const out = doc.getZip().generate({ type: 'blob' });
  
      // Save the file using file-saver
      saveAs(out, 'JWVehicles.docx');
    });
  } */
  

}




















// import { Component, OnInit } from '@angular/core';
// import { VehicleService } from '../../services/vehicle.service';
// import { Vehicle } from '../../models/vehicle.model';
// import { Router } from '@angular/router';
// import { Colour } from '../../models/colour.model';

// @Component({
//   selector: 'app-vehicle',
//   templateUrl: './vehicle.component.html',
//   styleUrls: ['./vehicle.component.css']
// })
// export class VehicleComponent implements OnInit{

//   vehicles: Vehicle[] = [];

//   vehicle!: Vehicle;

//   constructor(private vehicleService: VehicleService, private router: Router) { }

//   ngOnInit(): void {
//     this.loadVehicles();
//   }

//   loadVehicles(): void {
//     this.vehicleService.getAllVehicles().subscribe(
//       (data: Vehicle[]) => {
//         this.vehicles = data;
//       },
//       (error) => {
//         console.error('Error fetching vehicles:', error);
//       }
//     );
//   }


//   loadVehicle(vehicle: Vehicle): void {
//     this.router.navigate(['/edit-vehicle', vehicle.vehicleID]);
//   }

  
  
//   editVehicle(vehicleId: number){
//     this.router.navigate(['/edit-vehicle', vehicleId]);
//   }
  
//   deleteVehicle(vehicleID: number): void {
//     if (confirm('Are you sure you want to delete this vehicle?')) {
//       this.vehicleService.deleteVehicle(vehicleID).subscribe(
//         () => {
//           alert('Vehicle deleted successfully.');
//           // Optionally, refresh the list or handle the UI update here
//         },
//         error => {
//           alert('Failed to delete the vehicle.');
//           console.error('Delete failed', error);
//         }
//       );
//     }
  


// }
// }