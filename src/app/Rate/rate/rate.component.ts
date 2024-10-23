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
  searchRateID: string = '';
  rateToDelete: Rate | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
 projects: Project[] = []; // Replace with actual projects
  
  rateToEdit: Rate =  {
    RateID: 0,
    rateValue: 200,
    ProjectID: 0,
    ProjectNumber: 0,
    conditions: '',
    applicableTimePeriod: ''
  };
  isEditMode: boolean = false;

  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: TemplateRef<any>;
  @ViewChild('editRateModal') editRateModal!: TemplateRef<any>;

  constructor(private rateService: RateService,private projectService: ProjectService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetchRates();
    this.loadProjects();

  }

  fetchRates(): void {
    this.rateService.getAllRates().subscribe(
      (data: Rate[]) => {
        this.rates = data;
        console.log("Rates:", data);
        this.updateDisplayedRates();
      },
      error => {
        console.error('Error fetching rates', error);
      }
    );
  }
  
  loadProjects(): void {
    // Fetch project data from the ProjectService
    this.projectService.getAllProjects().subscribe(
      (projects: Project[]) => {
        console.log(this.projects);
        this.projects = projects;
      },
      error => {
        console.error('Error loading projects', error);
      }
    );
  }

  openAddRateModal(): void {
    this.isEditMode = false;
    //this.rateToEdit = new Rate(); // Reset the form
    this.modalService.open(this.editRateModal);
  }

  deleteRate(): void {
    if (this.rateToDelete) {
      this.rateService.deleteRate(this.rateToDelete.RateID).subscribe(
        () => {
          this.rates = this.rates.filter(r => r.RateID !== this.rateToDelete!.RateID);
          this.updateDisplayedRates();
          this.rateToDelete = null;
          this.modalService.dismissAll();
        },
        error => {
          console.error('Error deleting rate', error);
        }
      );
    }
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

  editRate(rate: Rate): void {
    this.isEditMode = true;
    this.rateToEdit = { ...rate };
    this.modalService.open(this.editRateModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveRate(): void {
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

  openDeleteConfirmation(rate: Rate): void {
    this.rateToDelete = rate;
    this.modalService.open(this.deleteConfirmationModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  searchRate(): void {
    if (this.searchRateID.trim() === '') {
      this.fetchRates();
    } else {
      this.rates = this.rates.filter(rate =>
        rate.RateID.toString().includes(this.searchRateID)
      );
      this.updateDisplayedRates();
    }
  }

  clearSearch(): void {
    this.searchRateID = '';
    this.fetchRates();
  }
}

