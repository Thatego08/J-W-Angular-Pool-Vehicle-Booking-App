import { Component } from '@angular/core';

@Component({
  selector: 'app-help-document',
  templateUrl: './help-document.component.html',
  styleUrl: './help-document.component.css'
})
export class HelpDocumentComponent {

  constructor() {}

  openWordDocument(): void {
    window.open('/assets/NewHelp.pdf', '_blank'); // Ensure the .docx extension is included
  }
  
}
