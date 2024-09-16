import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqadminComponent } from './faqadmin.component';

describe('FaqadminComponent', () => {
  let component: FaqadminComponent;
  let fixture: ComponentFixture<FaqadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaqadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
