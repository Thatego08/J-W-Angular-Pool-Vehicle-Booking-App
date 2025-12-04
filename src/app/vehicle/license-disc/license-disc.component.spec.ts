import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseDisksComponent } from './license-disc.component';

describe('LicenseDiscComponent', () => {
  let component: LicenseDisksComponent;
  let fixture: ComponentFixture<LicenseDisksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LicenseDisksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LicenseDisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
