import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolVehicleComponent } from './pool-vehicles.component';

describe('PoolVehiclesComponent', () => {
  let component: PoolVehicleComponent;
  let fixture: ComponentFixture<PoolVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoolVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoolVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
