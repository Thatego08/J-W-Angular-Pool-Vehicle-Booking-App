import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  feedbackData = { message: '', rating: 0 };

  constructor(private userService: UserService) { }

  submitFeedback() {
    this.userService.addFeedback(this.feedbackData).subscribe(response => {
      console.log('Feedback submitted:', response);
    }, error => {
      console.error('Feedback error:', error);
    });
  }
}
