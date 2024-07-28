import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Admin } from '../../models/admin';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.css'
})
export class EditAdminComponent implements OnInit {
  admins: Admin[] = [];
  admin: Admin | null = null; 
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userName = this.route.snapshot.paramMap.get('userName');
    if (userName) {
      this.adminService.getAdmin(userName).subscribe(
        (data: Admin) => {
          this.admin = data;
        },
        error => {
          console.error('Error fetching admin details', error);
          this.errorMessage = 'Error fetching admin details';
        }
      );
    }
  }

  updateAdmin(form: NgForm): void {
    if (this.admin) {
      this.adminService.updateAdmin(this.admin.userName, this.admin).subscribe(
        () => {
          this.router.navigate(['/manage-admins']); // Navigate back to the admin list after updating
        },
        error => {
          console.error('Error updating admin', error);
          this.errorMessage = 'Error updating admin';
        }
      );
    }
  }
    }
  