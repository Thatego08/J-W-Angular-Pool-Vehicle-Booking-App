import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolVehiclesComponent } from './pool-vehicles.component';

describe('PoolVehiclesComponent', () => {
  let component: PoolVehiclesComponent;
  let fixture: ComponentFixture<PoolVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoolVehiclesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoolVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
