import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from '../driver.service';
import { DriverModel } from '../driver.model';

@Component({
  selector: 'app-edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.css']
})
export class EditDriverComponent implements OnInit {
  editForm!: FormGroup;
  username!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private driverService: DriverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username') || '';

    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: [{ value: '', disabled: true }, Validators.required], // Programmatically disable the username field
      email: ['', [Validators.required, Validators.email]],
      number: ['', Validators.required]
    });

    if (this.username) {
      this.driverService.getDriverByUsername(this.username).subscribe(driver => {
        if (driver) {
          this.editForm.patchValue(driver);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedDriver: DriverModel = { ...this.editForm.getRawValue(), username: this.username };
      this.driverService.updateDriver(this.username, updatedDriver).subscribe(() => {
        alert('Driver updated successfully!');
        this.router.navigate(['/drivers']);
      }, error => {
        console.error('Failed to update driver:', error);
        alert('Failed to update driver. Please try again.');
      });
    }
  }
}
