import { Component, OnInit } from '@angular/core';
import { PostCheckService } from '../post-check.service';

@Component({
  selector: 'app-view-post-check',
  templateUrl: './view-post-check.component.html',
  styleUrls: ['./view-post-check.component.css']
})
export class ViewPostCheckComponent implements OnInit {

  selectedMedia: any;
  currentPage: number = 1;
  columnsPerPage: number = 10;
  visibleColumns: string[] = [];
  allColumns: string[] = [
    'postCheckId', 'closingKms', 'oilLeaks', 'fuelLevel', 'mirrors', 'sunVisor', 'seatBelts', 'headLights',
    'indicators', 'parkLights', 'brakeLights', 'strobeLight', 'reverseLight', 'reverseHooter', 'horn',
    'windscreenWiper', 'tyreCondition', 'spareWheelPresent', 'jackAndWheelSpannerPresent', 'brakes',
    'handbrake', 'jwMarketingMagnets', 'checkedByJWSecurity', 'licenseDiskValid', 'comments',
    'additionalComments', 'tripMedia',
  ];
  pagedPostChecks: any[] = [];
  postChecks: any[] = [];

  constructor(private postCheckService: PostCheckService) {}

  ngOnInit(): void {
    this.loadPostChecks();
  }

  loadPostChecks(): void {
    this.postCheckService.getAllPostChecks().subscribe(data => {
      console.log('Data from API:', data);
      this.postChecks = data;

      // Immediately update visible columns and paged data after loading
      this.updateVisibleColumns();
      this.updatePagedData();
    });
  }

  updateVisibleColumns() {
    // Determine which columns should be visible based on current page
    const startIndex = (this.currentPage - 1) * this.columnsPerPage;
    this.visibleColumns = this.allColumns.slice(startIndex, startIndex + this.columnsPerPage);
  }

  updatePagedData() {
    this.pagedPostChecks = this.postChecks.map((postCheck: any) => {
      const pagedCheck: { [key: string]: any } = {};
      
      this.visibleColumns.forEach(column => {
        pagedCheck[column] = postCheck[column];
      });
      
      return pagedCheck;
    });
  }

  showNextColumns() {
    if ((this.currentPage * this.columnsPerPage) < this.allColumns.length) {
      this.currentPage++;
      this.updateVisibleColumns();
      this.updatePagedData();
    }
  }

  showPreviousColumns() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisibleColumns();
      this.updatePagedData();
    }
  }

  openModal(media: any) {
    this.selectedMedia = media;
  }

  closeModal() {
    this.selectedMedia = null;
  }
}
