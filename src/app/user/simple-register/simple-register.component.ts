import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-simple-register',
  templateUrl: './simple-register.component.html',
  styleUrls: ['./simple-register.component.css']
})
export class SimpleRegisterComponent {
  user = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    password: ''
  };

  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.registerSimple(this.user).subscribe(
      response => {
        console.log('Registration successful', response);
        this.successMessage = response.message || 'Registration successful!';
        
        // Store token and user info
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        this.isSubmitting = false;
        
        // Redirect after successful registration
        setTimeout(() => {
          this.router.navigate(['/welcome']);
        }, 2000);
      },
      error => {
        console.error('Registration error:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isSubmitting = false;
      }
    );
  }
}