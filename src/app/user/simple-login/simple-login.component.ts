import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-simple-login',
  templateUrl: './simple-login.component.html',
  styleUrls: ['./simple-login.component.css']
})
export class SimpleLoginComponent {
  credentials = {
    userName: '',
    password: ''
  };

  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.loginSimple(this.credentials).subscribe(
      response => {
        console.log('Login successful', response);
        
        // Store token
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        this.successMessage = 'Login successful! Redirecting...';
        this.isSubmitting = false;
        
        // Redirect after successful login
        setTimeout(() => {
          this.router.navigate(['/welcome']);
        }, 1000);
      },
      error => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        this.isSubmitting = false;
      }
    );
  }
}