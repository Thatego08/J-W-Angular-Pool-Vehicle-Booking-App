import { Component } from '@angular/core';
import { AuthService } from '../../user/auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OTPComponent {

  // timeLeft!: number;
  // interval: any;
  // otpExpirationTime: number = 300; // Default 5 minutes in seconds, fetched from backend

  // constructor(private authService: AuthService) {}

  // ngOnInit(): void {
  //   this.authService.getOtpSettings().subscribe(settings => {
  //     this.otpExpirationTime = settings.expirationTimeInSeconds; // Fetch from API
  //     this.startTimer();
  //   });
  // }

  // startTimer(): void {
  //   this.timeLeft = this.otpExpirationTime;
  //   this.interval = setInterval(() => {
  //     if (this.timeLeft > 0) {
  //       this.timeLeft--;
  //     } else {
  //       clearInterval(this.interval);
  //       // Handle OTP expiration
  //     }
  //   }, 1000);
  // }

  // resendOtp() {
  //   // Logic to resend OTP
  //   this.startTimer(); // Restart timer after resending OTP
  // }
}
