import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPostCheckComponent } from './view-post-check.component';

describe('ViewPostCheckComponent', () => {
  let component: ViewPostCheckComponent;
  let fixture: ComponentFixture<ViewPostCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPostCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPostCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
