import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostCheckComponent } from './create-post-check.component';

describe('CreatePostCheckComponent', () => {
  let component: CreatePostCheckComponent;
  let fixture: ComponentFixture<CreatePostCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePostCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePostCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
