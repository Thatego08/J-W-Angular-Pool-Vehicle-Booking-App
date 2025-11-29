import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isActive = false;
  credentials = { userName: '', password: '' }; // userName will be email
  user = { name: '', surname: '', phoneNumber: '', email: '', password: '', confirmPassword: '', role: '', profilePhoto: null as File | null };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordFieldType: string = 'password';

  notificationMessage: string | null = null;
  isSuccess: boolean = true;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.user.profilePhoto = file;
  }

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
        this.successMessage = 'Login successful! Redirecting to welcome page...';
        setTimeout(() => {
          this.router.navigate(['/welcome']);
        }, 2000);
      },
      error => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials and try again.';
      }
    );
  }

  register() {
    const formData = new FormData();
   
    formData.append('name', this.user.name);
    formData.append('surname', this.user.surname);
    formData.append('phoneNumber', this.user.phoneNumber);
    formData.append('email', this.user.email);
    formData.append('password', this.user.password);
    formData.append('confirmPassword', this.user.confirmPassword);
    formData.append('role', this.user.role);
    
    if (this.user.profilePhoto) {
      formData.append('profilePhoto', this.user.profilePhoto);
    }
    
    this.authService.register(formData).subscribe(
      response => {
        console.log('Registration successful', response);
        this.notificationMessage = 'Registration successful! You can now login with your email.';
        this.isSuccess = true;
        
        // Clear form
        this.user = { name: '', surname: '', phoneNumber: '', email: '', password: '', confirmPassword: '', role: '', profilePhoto: null };
        
        setTimeout(() => {
          this.toggleForm(); // Switch to login form
        }, 2000);
      },
      error => {
        console.error('Registration error:', error);
        this.notificationMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isSuccess = false;
      }
    );
  }
}