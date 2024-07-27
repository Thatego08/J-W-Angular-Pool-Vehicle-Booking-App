import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefuelVehicleComponent } from './refuel-vehicle.component';

describe('RefuelVehicleComponent', () => {
  let component: RefuelVehicleComponent;
  let fixture: ComponentFixture<RefuelVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefuelVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefuelVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
