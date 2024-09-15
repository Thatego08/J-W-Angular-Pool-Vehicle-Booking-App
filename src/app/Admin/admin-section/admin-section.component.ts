import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../user/auth.service';

@Component({
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrl: './admin-section.component.css'
})
export class AdminSectionComponent {
  otpExpiration: number = 10;  // Default to 10 minutes
  currentExpiration: number = 0;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getOtpExpiration();
  }

  getOtpExpiration() {
    this.authService.getOtpExpiration().subscribe(
      (response: any) => {
        this.currentExpiration = response.expirationTime;
      },
      error => {
        console.error('Error fetching OTP expiration:', error);
      }
    );
  }

  updateOtpExpiration() {
    this.authService.updateOtpExpiration(this.otpExpiration).subscribe(
      response => {
        console.log('OTP expiration updated successfully');
        this.getOtpExpiration();  // Refresh the current expiration value
      },
      error => {
        console.error('Error updating OTP expiration:', error);
      }
    );
  }
}
