import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateEEComponent } from './rate-ee.component';

describe('RateEEComponent', () => {
  let component: RateEEComponent;
  let fixture: ComponentFixture<RateEEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RateEEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RateEEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
