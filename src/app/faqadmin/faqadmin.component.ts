import { Component, OnInit } from '@angular/core';
import { FaqService } from '../services/faq.service';
import { FAQ } from '../models/FAQ';

@Component({
  selector: 'app-faqadmin',
  templateUrl: './faqadmin.component.html',
  styleUrl: './faqadmin.component.css'
})
export class FaqadminComponent  implements OnInit {
  faqs: FAQ[] = [];
  newFaq: any = { question: '', answer: '' };
  editFaqId: number | null = null;
  editedFaq: FAQ = { faqId: 0, question: '', answer: '' };
  errorMessage: string = '';
  showError = false;

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs() {
    this.faqService.getAllFaqs().subscribe(data => {
      this.faqs = data;
    });
  }

  addFaq() {
    if (this.newFaq.question.trim() && this.newFaq.answer.trim()) {
      this.faqService.addFaq(this.newFaq).subscribe(() => {
        this.newFaq = { question: '', answer: '' }; // Reset form
        this.loadFaqs(); // Reload FAQs
        this.showError = false; // Hide error message
      }, (error) => {
        console.error('Error adding FAQ', error);
      });
    } else {
      this.showError = true; // Show error message
    }
  }

  updateFaq() {
    if (!this.editedFaq.question.trim() || !this.editedFaq.answer.trim()) {
      this.errorMessage = 'Question and answer fields cannot be empty';
      return;
    }

    if (this.editFaqId !== null) {
      this.faqService.updateFaq(this.editFaqId, this.editedFaq).subscribe(
        () => {
          this.editFaqId = null;
          this.editedFaq = { faqId: 0, question: '', answer: '' };
          this.loadFaqs();
          this.errorMessage = '';  // Clear the error message
        },
        (error) => {
          console.error('Error updating FAQ', error);  // Handle error properly
        }
      );
    }
  }

  deleteFaq(faq: FAQ) {
    const faqId = faq.faqId
    this.faqService.deleteFaq(faqId).subscribe(
      () => {
        // FAQ deleted successfully, reload FAQs
        this.loadFaqs();
      },
      (error) => {
        console.error('Error deleting FAQ', error);  // Handle error
      }
    );
  }

  editFaq(faq: FAQ) {
    this.editFaqId = faq.faqId;
    this.editedFaq = { ...faq }; // Load FAQ data into the edit form
  }

  cancelEdit() {
    this.editFaqId = null;
    this.editedFaq = { faqId: 0, question: '', answer: '' };
  }
};
