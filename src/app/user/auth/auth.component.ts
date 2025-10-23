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
  credentials = { userName: '', password: '' };
  user = { 
    name: '', 
    surname: '', 
    phoneNumber: '', 
    email: '', 
    password: '', 
    // confirmPassword: '', 
    profilePhoto: null as File | null 
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  notificationMessage: string | null = null;
  isSuccess: boolean = true;

  // 10. Track form submission state
  isSubmitting: boolean = false;

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.user.profilePhoto = file;
  }

  toggleForm() {
    this.isActive = !this.isActive;
    this.clearMessages();
    // 10. Reset form when toggling
    this.resetForm();
  }

  clearMessages() {
    this.errorMessage = null;
    this.successMessage = null;
    this.notificationMessage = null;
  }

  // 10. Reset form data
  resetForm() {
    this.user = { 
      name: '', 
      surname: '', 
      phoneNumber: '', 
      email: '', 
      password: '', 
     // confirmPassword: '', 
      profilePhoto: null 
    };
    this.isSubmitting = false;
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Login successful', response);
        localStorage.setItem('token', response.token);
        this.successMessage = 'Login successful! Redirecting...';
        setTimeout(() => {
          // 4. Redirect based on role (Admin gets full access)
          this.router.navigate(['/welcome']);
        }, 2000);
      },
      error => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
      }
    );
  }

  register() {
    // 10. Prevent multiple submissions
    if (this.isSubmitting) {
      return;
    }

    // // Validate passwords match
    // if (this.user.password !== this.user.confirmPassword) {
    //   this.notificationMessage = 'Passwords do not match.';
    //   this.isSuccess = false;
    //   return;
    // }

    // Validate JAWS email
    // if (!this.user.email.endsWith('@gmail.com')) {
    //   this.notificationMessage = 'Only JAWS email addresses (@jaws.co.za) are allowed.';
    //   this.isSuccess = false;
    //   return;
    // }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('Name', this.user.name);
    formData.append('Surname', this.user.surname);
    formData.append('PhoneNumber', this.user.phoneNumber);
    formData.append('Email', this.user.email);
    formData.append('Password', this.user.password);
   // formData.append('confirmPassword', this.user.confirmPassword);
    // Role is now automatically set to "Driver" in backend
    
    if (this.user.profilePhoto) {
      formData.append('profilePhoto', this.user.profilePhoto);
    }

    // DEBUG: Log what we're sending
  console.log('FormData contents:');
  for (let pair of (formData as any).entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }
    this.authService.register(formData).subscribe(
      response => {
        console.log('Registration successful', response);
        this.notificationMessage = response.message || 'Registration successful! Please check your email to confirm your account.';
        this.isSuccess = true;
        
        // 10. Reset form after successful registration
        setTimeout(() => {
          this.resetForm();
          this.router.navigate(['/auth']);
        }, 3000);
      },
      error => {
        console.error('Registration error:', error);
        this.notificationMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isSuccess = false;
        this.isSubmitting = false; // 10. Reset submitting state on error
      }
    );
  }
}