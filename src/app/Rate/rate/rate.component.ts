import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RateService } from '../../services/rate.service';
import { Rate } from '../../models/rate';
import { MatDialog } from '@angular/material/dialog';
import { RateFormComponent } from '../rate-form/rate-form.component';
import { Project } from '../../models/Project';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.css'
})
export class RateComponent implements OnInit {
  rates: Rate[] = [];
  displayedRates: Rate[] = [];
  projects: Project[] = [];
  searchRateTypeName: string = '';
  rateToEdit: Rate = {
    RateTypeName: '', ProjectNumber: 0, Conditions: '', RateValue: 0,
    RateID: 0,
    ApplicableTimePeriod: ''
  };
  isEditMode: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  rateTypes: string[] = ['half-day rate', 'full-day rate', 'kilometre rate'];

  @ViewChild('editRateModal') editRateModal!: TemplateRef<any>;

  constructor(
    private rateService: RateService,
    private projectService: ProjectService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fetchRates();
    this.fetchProjects();
  }

  fetchRates(): void {
    this.rateService.getAllRates().subscribe(
      (data: Rate[]) => {
        this.rates = data;
        this.updateDisplayedRates();
      },
      error => {
        console.error('Error fetching rates', error);
      }
    );
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (data: Project[]) => {
        this.projects = data;
      },
      error => {
        console.error('Error fetching projects', error);
      }
    );
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.rates.length / this.itemsPerPage);
  }

  updateDisplayedRates(): void {
    this.calculateTotalPages();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedRates = this.rates.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedRates();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedRates();
    }
  }

  openRateModal(rate: Rate | null): void {
    this.isEditMode = rate !== null;
    this.rateToEdit = rate ? { ...rate } : { RateID: 0, RateTypeName: '', RateValue: 0, ProjectNumber: 0, ApplicableTimePeriod: '', Conditions: '' };
    this.modalService.open(this.editRateModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveRate(): void {
    if (this.rateToEdit) {
      if (this.isEditMode) {
        this.rateService.updateRate(this.rateToEdit.RateID, this.rateToEdit).subscribe(
          () => {
            this.fetchRates();
            this.modalService.dismissAll();
          },
          error => {
            console.error('Error updating rate', error);
          }
        );
      } else {
        this.rateService.createRate(this.rateToEdit).subscribe(
          () => {
            this.fetchRates();
            this.modalService.dismissAll();
          },
          error => {
            console.error('Error creating rate', error);
          }
        );
      }
    }
  }

  searchRates(): void {
    if (this.searchRateTypeName.trim() === '') {
      this.fetchRates();
    } else {
      this.rates = this.rates.filter(rate =>
        rate.RateTypeName?.toLowerCase().includes(this.searchRateTypeName.toLowerCase())
      );
      this.updateDisplayedRates();
    }
  }

 
  clearSearch(): void {
    this.searchRateTypeName = '';
    this.fetchRates();
  }
}

