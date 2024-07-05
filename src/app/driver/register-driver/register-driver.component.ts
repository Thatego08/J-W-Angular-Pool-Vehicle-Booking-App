import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { DriverModel } from '../../models/driver.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.component.html',
  styleUrls: ['./register-driver.component.css']
})
export class RegisterDriverComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private driverService: DriverService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      number: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData: DriverModel = this.registrationForm.value;
      this.driverService.registerDriver(formData).subscribe(
        () => {
          console.log('Driver registered successfully!');
          this.registrationForm.reset();
          alert('Driver registered successfully!');
          this.router.navigate(['/drivers']);
        },
        error => {
          console.error('Failed to register driver:', error);
          alert('Failed to register driver. Please try again.');
        }
      );
    }
  }
}
