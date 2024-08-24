import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetRefuelVehicleComponent } from './get-refuel-vehicle.component';

describe('GetRefuelVehicleComponent', () => {
  let component: GetRefuelVehicleComponent;
  let fixture: ComponentFixture<GetRefuelVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetRefuelVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetRefuelVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
