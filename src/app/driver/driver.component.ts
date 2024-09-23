import { Component, OnInit } from '@angular/core';
import { DriverService } from '../services/driver.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  drivers: any[] = [];
  searchUsername: string = '';
  searchedDriver: any = null; // Variable to hold the searched driver

  constructor(private driverService: DriverService, private router: Router) { }

  ngOnInit() {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.driverService.getAllDrivers().subscribe(
      (data: any[]) => {
        this.drivers = data;
      },
      error => {
        console.error('Error fetching drivers', error);
      }
    );
  }


  deleteDriver(userName: string) {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.driverService.deleteDriver(userName).subscribe(
        () => {
          // Remove deleted driver from local list
          this.drivers = this.drivers.filter(d => d.userName !== userName);
          // Clear searched driver when deleted
          if (this.searchedDriver && this.searchedDriver.userName === userName) {
            this.searchedDriver = null;
          }
        },
        error => {
          console.error('Error deleting driver', error);
        }
      );
    }
  }

  searchDriver() {
    if (this.searchUsername.trim() === '') {
      // If search input is empty, fetch all drivers
      this.fetchDrivers();
    } else {
      // Filter drivers based on username
      this.drivers = this.drivers.filter(driver =>
        driver.userName.toLowerCase().includes(this.searchUsername.toLowerCase())
      );
    }
  }

  clearSearch() {
    this.searchUsername = ''; // Clear the search input
    this.fetchDrivers(); // Fetch all drivers to reset the list
  }

    // New method to export drivers as JSON
    exportDriversToJson() {
      const json = JSON.stringify(this.drivers, null, 2); // Convert drivers to JSON string
      const blob = new Blob([json], { type: 'application/json' }); // Create a blob from the JSON string
      saveAs(blob, 'drivers.json'); // Use file-saver to save the blob as a file
    }
}
