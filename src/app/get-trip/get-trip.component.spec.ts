import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTripComponent } from './get-trip.component';

describe('GetTripComponent', () => {
  let component: GetTripComponent;
  let fixture: ComponentFixture<GetTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetTripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
