import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit{
  isActive = false;  // Control active state for form toggle
  credentials = { userName: '', password: '' };
  user = { name: '', surname: '', phoneNumber: '', email: '', password: '', confirmPassword: '', role: '' };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordFieldType: string = 'password'; // Password field type

 

  ngOnInit(): void {}

  toggleForm() {
    this.isActive = !this.isActive;
    this.clearMessages();
  }
  clearMessages() {
    this.errorMessage = null;
    this.successMessage = null;
  }
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Login successful', response);
        localStorage.setItem('token', response.token);
        this.successMessage = 'Login successful! Redirecting to dashboard...';
        setTimeout(() => {
          this.router.navigate(['/app-dashboard']);
        }, 2000);
      },
      error => {
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    );
  }

 register() {
    this.authService.register(this.user).subscribe(
      response => {
        console.log('Registration successful', response);
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 2000);
      },
      error => {
        console.error('Registration error:', error);
        this.errorMessage = error.error.message || 'Registration failed. Please try again.';
      }
    );
  }



}