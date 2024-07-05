import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { userName: '', password: '' };

  errorMessage: string | null = null;
  successMessage: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        //Successful login
        console.log('Login successful', response);
        localStorage.setItem('token', response.token);
        this.successMessage = 'Login successful! Redirecting to dashboard...';
      //this.router.navigate(['/app-dashboard']);
      setTimeout(() => {
        this.router.navigate(['/app-dashboard']);
      }, 2000);
      },
      //Unsuccessful login
      error => {
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    );
  }
}
