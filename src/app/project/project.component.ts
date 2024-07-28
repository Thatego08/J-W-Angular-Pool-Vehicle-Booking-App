import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../models/Project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  displayedProjects: Project[] = [];
  searchProjectNumber: string = '';
  projectToDelete: Project | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: TemplateRef<any>;

  constructor(private projectService: ProjectService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (data: Project[]) => {
        this.projects = data;
        this.updateDisplayedProjects();
      },
      error => {
        console.error('Error fetching projects', error);
      }
    );
  }

  deleteProject(): void {
    if (this.projectToDelete) {
      this.projectService.deleteProject(this.projectToDelete.projectID).subscribe(
        () => {
          console.log('Project deleted:', this.projectToDelete!.projectID);
          this.projects = this.projects.filter(p => p.projectID !== this.projectToDelete!.projectID);
          this.updateDisplayedProjects();
          this.projectToDelete = null;
          this.modalService.dismissAll();
        },
        error => {
          console.error('Error deleting project', error);
        }
      );
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.projects.length / this.itemsPerPage);
  }

  updateDisplayedProjects(): void {
    this.calculateTotalPages();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProjects = this.projects.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProjects();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProjects();
    }
  }

  editProject(project: Project): void {
    this.router.navigate([`/edit-project/${project.projectID}`]);
  }

  openDeleteConfirmation(project: Project): void {
    this.projectToDelete = project;
    this.modalService.open(this.deleteConfirmationModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  searchProject(): void {
    if (this.searchProjectNumber.trim() === '') {
      this.fetchProjects();
    } else {
      this.projects = this.projects.filter(project =>
        project.projectNumber.toString().includes(this.searchProjectNumber)
      );
      this.updateDisplayedProjects();
    }
  }

  addProject(): void {
    this.router.navigate(['/add-project']);
  }

  clearSearch(): void {
    this.searchProjectNumber = '';
    this.fetchProjects();
  }
}
