import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  otpForm: FormGroup;
  resetPasswordForm: FormGroup;
  step: number = 1; // Tracks which step the user is on (1: Submit Email, 2: Enter OTP, 3: Reset Password)
  token: string | null=null;
  notificationMessage: string | null = null;
  isSuccess: boolean = true;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Step 1: Submit email to receive OTP
  submitEmail() {
    if (this.emailForm.valid) {
      this.authService.forgotPassword(this.emailForm.value).subscribe(
        res => {
          console.log('OTP sent successfully', res);
          
          this.notificationMessage = 'OTP sent successfully';
          this.step = 2; // Move to step 2 (Enter OTP)
        },
        err => console.error('Error sending OTP', err)
      );
    }
    
  }

  // Step 2: Verify OTP
  verifyOtp() {
    if (this.otpForm.valid) {
      const data = {
        email: this.emailForm.value.email,
        otp: this.otpForm.value.otp
      };

      this.authService.verifyOtp(data).subscribe(
        res => {
          console.log('OTP verified successfully', res);
          
          this.notificationMessage = 'OTP verified successfully';
          this.token = res.token;
          console.log('Token:', this.token);
          this.step = 3; // Move to step 3 (Reset Password)
        },
        err => console.error('Error verifying OTP', err)
      );
    }
  }

  // Step 3: Reset password
  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const data = {
        email: this.emailForm.value.email,
        otp: this.otpForm.value.otp,
        token: this.token,
        newPassword: this.resetPasswordForm.value.newPassword
      };

      this.authService.resetPassword(data).subscribe(
        res => {
          console.log('Password reset successful', res);

          
          this.notificationMessage = 'Your Password has been reset!';
            //Delay for notification purposes
            setTimeout(() => {
              this.router.navigate(['/auth']);
            }, 3000); // 3 seconds delay
        },
        err => console.error('Error resetting password', err)
      );
    }
  }
}
