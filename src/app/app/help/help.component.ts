import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpService } from '../../services/help.service'; // Adjust path as necessary

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  helpContents: { content: string, highlighted: string }[] = [];
  searchQuery: string = '';
  currentScreen: string = '';
  showHelp: boolean = true; // Initialize the help visibility flag

  constructor(
    private helpService: HelpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      this.currentScreen = urlSegments.map(segment => segment.path).join('-');
      this.loadHelpContents();
    });
  }

  loadHelpContents(): void {
    if (this.searchQuery.trim()) {
      this.helpContents = this.helpService.searchHelp(this.currentScreen, this.searchQuery);
    } else {
      const contents = this.helpService.getHelpContents(this.currentScreen);
      this.helpContents = contents.map(content => ({
        content,
        highlighted: this.highlightSearchQuery(content)
      }));
    }
  }

  searchHelp(): void {
    this.loadHelpContents();
  }

  toggleHelp(): void {
    this.showHelp = !this.showHelp; // Toggle the visibility
  }

  highlightSearchQuery(content: string): string {
    if (!this.searchQuery.trim()) {
      return content;
    }
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return content.replace(regex, '<span class="highlight">$1</span>');
  }
}
