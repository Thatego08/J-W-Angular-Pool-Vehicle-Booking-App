import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseDiscComponent } from './license-disc.component';

describe('LicenseDiscComponent', () => {
  let component: LicenseDiscComponent;
  let fixture: ComponentFixture<LicenseDiscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LicenseDiscComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LicenseDiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
