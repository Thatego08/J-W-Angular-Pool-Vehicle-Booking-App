import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RatesEE } from '../models/ratesEE';
import { RateEEserviceService } from '../services/rate-eeservice.service';
import { Project } from '../models/Project';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-rate-ee',
  templateUrl: './rate-ee.component.html',
  styleUrl: './rate-ee.component.css'
})
export class RateEEComponent {

  rates: RatesEE[] = [];
  projects: Project[] = [];
  rateForm: FormGroup;
  isEdit = false;
  selectedRateId: number | null = null;
  showForm = false;

  constructor(
    private fb: FormBuilder,
    private rateService: RateEEserviceService,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {
    this.rateForm = this.fb.group({
      rateName: ['', Validators.required],
      rateValue: [0, [Validators.required, Validators.min(0)]],
      effectiveDate: [''],
      expiryDate: [''],
      isActive: [true],
      projectId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRates();
    this.loadProjects();
  }

  loadRates(): void {
    this.rateService.getAllRates().subscribe({
      next: (data) => (this.rates = data),
      error: (err) => this.toastr.error('Failed to load rates')
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => (this.projects = data),
      error: (err) => this.toastr.error('Failed to load projects')
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.rateForm.reset({ isActive: true, rateValue: 0 });
    this.isEdit = false;
    this.selectedRateId = null;
  }

  onEdit(rate: RatesEE): void {
    this.isEdit = true;
    this.selectedRateId = rate.rateId!;
    this.rateForm.patchValue({
      rateName: rate.rateName,
      rateValue: rate.rateValue,
      effectiveDate: rate.effectiveDate ? rate.effectiveDate.substring(0, 16) : '', // for datetime-local
      expiryDate: rate.expiryDate ? rate.expiryDate.substring(0, 16) : '',
      isActive: rate.isActive,
      projectId: rate.projectId
    });
    this.showForm = true;
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this rate?')) {
      this.rateService.deleteRate(id).subscribe({
        next: () => {
          this.toastr.success('Rate deleted successfully');
          this.loadRates();
        },
        error: (err) => this.toastr.error('Delete failed')
      });
    }
  }

 onSubmit(): void {
  if (this.rateForm.invalid) {
    this.toastr.warning('Please fill all required fields');
    return;
  }

  const formValue = this.rateForm.value;

  // Build the payload with only the fields the backend expects
  const payload: any = {
    rateName: formValue.rateName,
    rateValue: formValue.rateValue,
    effectiveDate: formValue.effectiveDate ? new Date(formValue.effectiveDate).toISOString() : null,
    expiryDate: formValue.expiryDate ? new Date(formValue.expiryDate).toISOString() : null,
    isActive: formValue.isActive,
    projectId: formValue.projectId
  };

  if (this.isEdit && this.selectedRateId) {
    // For update, include the rateId
    payload.rateId = this.selectedRateId;

    this.rateService.updateRate(this.selectedRateId, payload).subscribe({
      next: () => {
        this.toastr.success('Rate updated');
        this.loadRates();
        this.toggleForm();
      },
      error: (err) => {
        console.error('Update error:', err.error);
        this.toastr.error('Update failed');
      }
    });
  } else {
    // For create, do NOT include rateId
    this.rateService.createRate(payload).subscribe({
      next: () => {
        this.toastr.success('Rate created');
        this.loadRates();
        this.toggleForm();
      },
      error: (err) => {
        console.error('Creation error:', err.error);
        this.toastr.error('Creation failed');
      }
    });
  }
}

}
