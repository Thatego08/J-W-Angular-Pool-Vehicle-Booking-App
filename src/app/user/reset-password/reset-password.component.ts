import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',

  styleUrl: './reset-password.component.css'
})


export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token!: string;
  email!: string;

  notificationMessage: string | null = null;
  isSuccess: boolean = true;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      token: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
    this.resetPasswordForm.patchValue({ token: this.token, email: this.email });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe(
        res => {
          console.log('Password reset successfully', res);
          
          this.notificationMessage = 'Your Password has been reset!';
         
          //this.router.navigate(['/auth']);

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