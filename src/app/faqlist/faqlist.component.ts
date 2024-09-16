import {  Component, OnInit } from '@angular/core';
import { FaqService } from '../services/faq.service';
import { FAQ } from '../models/FAQ';

@Component({
  selector: 'app-faqlist',
  templateUrl: './faqlist.component.html',
  styleUrl: './faqlist.component.css'
})
export class FaqlistComponent implements OnInit {
    faqs: FAQ[] = [];
    activeFaqId: number | null = null;  // Track the currently active FAQ

    constructor(private faqService: FaqService) { }
  
    ngOnInit(): void {
      this.faqService.getAllFaqs().subscribe(data => {
        this.faqs = data;  // No need to add 'isOpen'
      });
    }
  
    toggleFaq(faqId: number) {
      this.activeFaqId = this.activeFaqId === faqId ? null : faqId;  // Toggle FAQ by ID
    }
}
