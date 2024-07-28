import { Component, OnInit } from '@angular/core';
import { RateService } from '../../services/rate.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.css'
})
export class RateComponent implements OnInit {
  rates: any[] = [];
  searchProjectNumber: string = '';

  constructor(private rateService: RateService) { }

  ngOnInit(): void {
    this.fetchRates();
  }

  fetchRates() {
    this.rateService.getAllRates().subscribe(
      (data) => {
        this.rates = data;
      },
      (error) => {
        console.error('Error fetching rates', error);
      }
    );
  }

  addRate() {
    // Logic to open a modal or navigate to a rate creation form
  }

  editRate(rate: any) {
    // Logic to open a modal or navigate to a rate edit form with the rate data
  }

  searchRates() {
    // Implement search logic here, possibly filtering this.rates array based on searchProjectNumber
  }

  filteredRates() {
    if (!this.searchProjectNumber.trim()) {
      return this.rates;
    }
    return this.rates.filter(rate =>
      rate.projectNumber.toString().includes(this.searchProjectNumber)
    );
  }
}
