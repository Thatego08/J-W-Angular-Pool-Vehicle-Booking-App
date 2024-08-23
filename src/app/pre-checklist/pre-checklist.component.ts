// pre-checklist.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreChecklistService } from '../pre-checklist.service';

@Component({
  selector: 'app-pre-checklist',
  templateUrl: './pre-checklist.component.html',
  styleUrls: ['./pre-checklist.component.css']
})
export class PreChecklistComponent {
  preChecklist: any = {
   
    openingKms: 0,
    oilLeaks: false,
    fuelLevel: false,
    mirrors: false,
    sunVisor: false,
    seatBelts: false,
    headLights: false,
    indicators: false,
    parkLights: false,
    brakeLights: false,
    strobeLight: false,
    reverseLight: false,
    reverseHooter: false,
    horn: false,
    windscreenWiper: false,
    tyreCondition: false,
    spareWheelPresent: false,
    jackAndWheelSpannerPresent: false,
    brakes: false,
    handbrake: false,
    jwMarketingMagnets: false,
    checkedByJWSecurity: false,
    licenseDiskValid: false,
    comments: '',
    additionalComments: ''
  };

  bookingId: number | null = null;

  constructor(private preChecklistService: PreChecklistService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['bookingId']) {
        this.bookingId = +params['bookingId']; // Parse bookingId
      }
    });
  }

  onSubmit() {
    this.preChecklistService.createPreChecklist(this.preChecklist)
      .subscribe(
        (response: any) => {
          const preChecklistId = response.preChecklistId; // Adjust based on actual response
          if (this.bookingId) {
            this.router.navigate(['/create-trip'], { queryParams: { preChecklistId: preChecklistId, bookingId: this.bookingId } });
          }
        },
        (error) => {
          console.error('Error submitting checklist', error);
        }
      );
  }
}  