import { Component, OnInit } from '@angular/core';
import { PostCheckService } from '../post-check.service';

@Component({
  selector: 'app-view-post-check',
  templateUrl: './view-post-check.component.html',
  styleUrls: ['./view-post-check.component.css']
})
export class ViewPostCheckComponent implements OnInit {
  postChecks: any[] = [];
  selectedMedia: any; // To store the currently selected media for modal view

  constructor(private postCheckService: PostCheckService) { }

  ngOnInit(): void {
    this.postCheckService.getAllPostChecks().subscribe(data => {
      console.log('Data from API:', data); // Debugging line
      this.postChecks = data;
    });
  }

  openModal(media: any): void {
    this.selectedMedia = media;
    document.getElementById('imageModal')!.style.display = 'block';
  }

  closeModal(): void {
    this.selectedMedia = null;
    document.getElementById('imageModal')!.style.display = 'none';
  }
}
