import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Feedback } from '../../models/feedback.model';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  feedback: Feedback = {
    userName: '',
    email: '',
    message: '',
    timestamp: new Date(),
    rating: 0
  };
  message: string = '';
  ratings: number[] = [1, 2, 3, 4, 5];

  constructor(private feedbackService: AuthService) {}

  submitFeedback() {
    this.feedbackService.submitFeedback(this.feedback).subscribe(
      response => {
        this.message = 'Feedback submitted successfully.';
        this.feedback = {
          userName: '',
          email: '',
          message: '',
          timestamp: new Date(),
          rating: 0
        };
      },
      error => {
        this.message = 'An error occurred while submitting feedback.';
      }
    );
  }
}
