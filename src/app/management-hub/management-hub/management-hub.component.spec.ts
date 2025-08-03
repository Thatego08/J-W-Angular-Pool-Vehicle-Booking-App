import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementHubComponent } from './management-hub.component';

describe('ManagementHubComponent', () => {
  let component: ManagementHubComponent;
  let fixture: ComponentFixture<ManagementHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementHubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagementHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
