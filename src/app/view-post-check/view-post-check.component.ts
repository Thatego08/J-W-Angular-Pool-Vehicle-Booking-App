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
  displayedRows: number = 5;
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
      this.postChecks = data;
      this.updateVisibleColumns();
      this.updatePagedData();
    });
  }

  updateVisibleColumns() {
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

  toggleRows() {
    // Toggle between showing 5 rows or all rows
    this.displayedRows = this.displayedRows === 5 ? this.pagedPostChecks.length : 5;
  }
}
