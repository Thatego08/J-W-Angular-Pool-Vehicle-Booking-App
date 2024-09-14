import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent {
  editProfileForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProfileEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.editProfileForm = this.fb.group({
      currentPassword: [''],
      newPassword: ['']
    });
  }

  onSave(): void {
    if (this.editProfileForm.valid) {
      this.dialogRef.close(this.editProfileForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
