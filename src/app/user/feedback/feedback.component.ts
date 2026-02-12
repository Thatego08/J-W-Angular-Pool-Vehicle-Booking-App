import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Feedback } from '../../models/feedback.model';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedback: Feedback = {
    userName: '',
    email: '',
    message: '',
    timestamp: new Date(),
    rating: 0
  };
  message: string = '';
  ratings: number[] = [1, 2, 3, 4, 5];

  // Store full user details for display
  currentUser: any = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  /**
   * Fetch the logged-in user's profile from the backend.
   */
  loadCurrentUser(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        // Pre‑fill the feedback object with user details
        this.feedback.userName = user.userName;
        this.feedback.email = user.email;
      },
      error: (err) => {
        console.error('Error fetching user profile', err);
        this.errorMessage = 'Unable to load user information. Please log in again.';
        // Optionally redirect to login
        // this.router.navigate(['/auth']);
      }
    });
  }

  /**
   * Submit feedback – only message and rating are editable.
   */
  submitFeedback(): void {
    // Ensure timestamp is set
    this.feedback.timestamp = new Date();

    this.authService.submitFeedback(this.feedback).subscribe({
      next: (response) => {
        this.message = 'Feedback submitted successfully. Thank you!';
        // Clear only the message and rating – keep user info
        this.feedback.message = '';
        this.feedback.rating = 0;
      },
      error: (error) => {
        this.message = 'An error occurred while submitting feedback.';
        console.error('Feedback error', error);
      }
    });
  }
}