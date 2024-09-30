import { Component,OnInit } from '@angular/core';
import { AuthService } from '../user/auth.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  constructor(public authService: AuthService) {
  }

  NgOnInit(): void {
  this.authService.isAdmin();
  
  this.authService.isDriver();
  }
}
