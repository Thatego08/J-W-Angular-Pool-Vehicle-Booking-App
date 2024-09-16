import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './user/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Admin-Account';
  isLoggedIn: Observable<boolean>;
  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn;
  }
}
