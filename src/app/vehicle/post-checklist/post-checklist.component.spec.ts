import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostChecklistComponent } from './post-checklist.component';

describe('PostChecklistComponent', () => {
  let component: PostChecklistComponent;
  let fixture: ComponentFixture<PostChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostChecklistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
