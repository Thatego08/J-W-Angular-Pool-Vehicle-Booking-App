import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Feedback } from '../../models/feedback.model';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.css'
})
export class FeedbackListComponent implements OnInit {
  feedbacks: Feedback[] = [];

  constructor(private feedbackService: AuthService) {}

  ngOnInit(): void {
    this.feedbackService.getAllFeedbacks().subscribe(
      feedbacks => {
        this.feedbacks = feedbacks;
      },
      error => {
        console.error('An error occurred while retrieving feedbacks.', error);
      }
    );
  }
}