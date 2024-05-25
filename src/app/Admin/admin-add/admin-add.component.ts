import { Component } from '@angular/core';
import { User } from '../../models/user';
import { AdminService } from '../../admin-services/admin.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrl: './admin-add.component.css'
})
export class AdminAddComponent {
  newAdmin: User = new User();

  constructor(public activeModal: NgbActiveModal, private adminService: AdminService) { }

  addAdmin(): void {
    this.adminService.AddAdmins(this.newAdmin).subscribe(() => {
      this.activeModal.close('success');
    }, error => {
      console.error('Error adding admin:', error);
      this.activeModal.dismiss(error);
    });
  }
}
