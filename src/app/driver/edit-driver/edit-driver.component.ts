import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DriverModel } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';

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
      this.driverService.updateDriver(this.updatedDriver.userName, this.updatedDriver).subscribe({
        next: (response) => {
          this.successMessage = 'Driver updated successfully';
          setTimeout(() => {
            this.router.navigate(['driver']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = `Error updating driver: ${error.error}`;
          console.error('Error updating driver', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(["driver"]);
  }
}
