import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DriverModel } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';
import { AbstractControl } from '@angular/forms';  // Import AbstractControl

@Component({
  selector: 'app-edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.css']
})
export class EditDriverComponent implements OnInit {
  
  updatedDriver: DriverModel = {
    userName: '',
    name: '',
    surname: '',
    email: '',
    phoneNumber: ''
  };

  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;  // New loading indicator

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userName = params.get('userName');
      if (userName) {
        this.driverService.getDriver(userName).subscribe({
          next: (response) => {
            this.updatedDriver = response;
          },
          error: (error) => {
            this.errorMessage = 'Error fetching driver details';
            console.error(error);
          }
        });
      }
    });
  }

  updateDrivers(form: NgForm) {
    if (form.valid) {
      this.loading = true;  // Set loading to true when updating starts
      this.driverService.updateDriver(this.updatedDriver.userName, this.updatedDriver).subscribe({
        next: () => {
          this.successMessage = 'Driver updated successfully';
          this.loading = false;  // Reset loading
          setTimeout(() => {
            this.router.navigate(['driver']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = `Error updating driver: ${error.error}`;
          this.loading = false;  // Reset loading
          console.error('Error updating driver', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(["driver"]);
  }

  // Helper method to safely access form controls
  getControl(form: NgForm, controlName: string): AbstractControl<any, any> | null {
    return form.controls[controlName] as AbstractControl<any, any>;
  }
}
