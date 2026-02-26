import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../models/Project';
import { RatesEE } from '../models/ratesEE';
import { Status } from '../models/status.model';
import { RateEEserviceService } from '../services/rate-eeservice.service';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedProject: Project | null = null;
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 5;

  newProject: Partial<Project> = { rateID: [] }; // initialize with empty rate array
  statuses: Status[] = [];
  rates: RatesEE[] = [];

  constructor(
    private projectService: ProjectService,
    private rateService: RateEEserviceService,
    private statusService: StatusService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.loadStatuses();
    this.loadRates();
  }

  // Getter for total pages (used in pagination)
  get totalPages(): number {
    return Math.ceil(this.projects.length / this.itemsPerPage);
  }

  // Getter for page numbers array
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  loadStatuses(): void {
    this.statusService.getStatuses().subscribe({
      next: (statuses) => (this.statuses = statuses),
      error: (err) => console.error('Failed to load statuses', err)
    });
  }

  loadRates(): void {
    this.rateService.getAllRates().subscribe({
      next: (rates) => (this.rates = rates),
      error: (err) => console.error('Failed to load rates', err)
    });
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = [...this.projects];
        this.updateDisplayedProjects();
      },
      error: (err) => console.error('Failed to load projects', err)
    });
  }

  updateDisplayedProjects(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProjects = this.projects.slice(start, start + this.itemsPerPage);
  }

  searchProjects(): void {
    if (!this.searchQuery.trim()) {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(
        (p) =>
          p.projectNumber.toString().includes(this.searchQuery) ||
          p.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.updateDisplayedProjects();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedProjects();
  }

  openAddModal(content: any): void {
    this.newProject = { rateID: [] }; // reset form
    this.modalService.open(content);
  }

  openEditModal(content: any, project: Project): void {
    // Clone the project and ensure rateID is a new array
     // Ensure rateID is an array (default to empty array if not)
    const rateID = Array.isArray(project.rateID) ? project.rateID : [];
    this.selectedProject = { ...project, rateID: [...project.rateID] };
    this.modalService.open(content);
  }

  addProject(): void {
    // Check required fields
    if (!this.newProject.projectNumber || !this.newProject.jobNo || 
        !this.newProject.taskCode || !this.newProject.activityCode || 
        !this.newProject.description || !this.newProject.statusId) {
      console.warn('Please fill all required fields');
      // Optionally show a toastr warning
      return;
    }

    // Ensure rateID is at least an empty array
    const payload = {
      ...this.newProject,
      rateID: this.newProject.rateID || []
    };

    this.projectService.addProject(payload as Project).subscribe({
      next: (response) => {
        console.log(response);
        this.fetchProjects();
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error('Add failed', err);
        console.error('Validation errors:', err.error?.errors);
      }
    });
  }

  updateProject(): void {
    if (this.selectedProject && this.selectedProject.projectID) {
      this.projectService
        .updateProject(this.selectedProject.projectID, this.selectedProject)
        .subscribe({
          next: () => {
            this.fetchProjects();
            this.modalService.dismissAll();
          },
          error: (err) => console.error('Update failed', err)
        });
    }
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => this.fetchProjects(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  getStatusBadgeClass(statusName: string | undefined): string {
  switch (statusName?.toLowerCase()) {
    case 'active':
      return 'bg-active';
    case 'inactive':
      return 'bg-inactive';
    case 'concluded':
      return 'bg-concluded';
    default:
      return 'bg-unknown';
  }
}

}