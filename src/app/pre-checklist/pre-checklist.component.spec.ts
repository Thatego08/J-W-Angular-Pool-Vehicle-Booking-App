import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreChecklistComponent } from './pre-checklist.component';

describe('PreChecklistComponent', () => {
  let component: PreChecklistComponent;
  let fixture: ComponentFixture<PreChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreChecklistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
