import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notifications',
  template: `
  <mat-card [ngClass]="{'success': isSuccess, 'error': !isSuccess}">
    <mat-card-content>
      <p>{{ message }}</p>
    </mat-card-content>
  </mat-card>
`,
styles: [`
  .success {
    background-color: #dff0d8;
    color: #3c763d;
  }
  .error {
    background-color: #f2dede;
    color: #a94442;
  }
  mat-card {
    margin: 20px auto;
    max-width: 400px;
    text-align: center;
  }
`]
})
export class NotificationsComponent {

  @Input() message: string = '';
  @Input() isSuccess: boolean = true;
}
