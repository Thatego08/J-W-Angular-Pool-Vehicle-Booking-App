import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../models/Project';
import { Rate } from '../models/rate';
import { RateService } from '../services/rate.service';

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
Math: any;
newProject: any;
rates: Rate[] = []; 

  constructor(private projectService: ProjectService,private rateService: RateService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.fetchRates();
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe((projects: Project[]) => {
      this.projects = projects;
      this.filteredProjects = [...this.projects];  // Initialize filtered projects
      this.updateDisplayedProjects();
    });
  }
  fetchRates(): void {
    this.rateService.getAllRates().subscribe((rates) => {
      this.rates = rates;
    });
  }

  updateDisplayedProjects(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredProjects = this.projects.slice(startIndex, endIndex);
  }

  searchProjects(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.projectNumber.toFixed().includes(this.searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.updateDisplayedProjects();
  }
  
  // Pagination handling
  changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updateDisplayedProjects();
  }
  
  // Handle opening the modal for adding or editing
  openProjectModal(content: any, project?: Project): void {
    this.selectedProject = project ? { ...project } : null; // Clone the project to avoid direct mutations
    this.modalService.open(content);
  }
  
  // Handle adding a new project
  addProject(newProject: Project): void {
    this.projectService.addProject(newProject).subscribe(() => {
      this.fetchProjects(); // Refresh the list after adding
      this.modalService.dismissAll();
    });
  }
  
  // Handle updating a project
  updateProject(updatedProject: Project): void {
    if (this.selectedProject) {
      this.projectService.updateProject(this.selectedProject.projectID, updatedProject).subscribe(() => {
        this.fetchProjects(); // Refresh the list after updating
        this.modalService.dismissAll();
      });
    }
  }
  
  // Handle deleting a project
  deleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe(() => {
        this.fetchProjects(); // Refresh the list after deleting
      });
    }
  }
  
}
