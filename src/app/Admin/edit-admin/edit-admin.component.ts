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
  successMessage: string | null = null;
  errorMessage: string | null = null;
  adminToEdit: Admin = { userName: '', name: '', surname: '', email: '', phoneNumber: '' };

  @ViewChild('editAdminModal') editAdminModal!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
    private modalService: NgbModal
  ) { }

 
  ngOnInit() {
    const userName = this.route.snapshot.paramMap.get('userName');
    if (userName) {
      this.adminService.getAdmin(userName).subscribe(
        (data: Admin) => this.admin = data,
        error => console.error('Error fetching admin details', error)
      );
    }
  }



  openEditAdminModal(admin: Admin) {
    this.adminToEdit = { ...admin }; // Clone the admin object to avoid direct mutation
    this.modalService.open(this.editAdminModal);
  }

  updateAdmin() {
    if (this.adminToEdit) {
      this.adminService.updateAdmin(this.adminToEdit.userName, this.adminToEdit).subscribe(
        updatedAdmin => {
          const index = this.admins.findIndex(a => a.userName === updatedAdmin.userName);
          if (index !== -1) {
            this.admins[index] = updatedAdmin;
          }
          this.modalService.dismissAll();
          this.successMessage = "Admin updated successfully!";
        },
        error => {
          this.errorMessage = 'Error updating admin';
          console.error('Error updating admin', error);
        }
      );
    }
  }
}