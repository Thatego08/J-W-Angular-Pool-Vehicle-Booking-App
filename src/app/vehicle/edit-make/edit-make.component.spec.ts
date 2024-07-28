import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMakeComponent } from './edit-make.component';

describe('EditMakeComponent', () => {
  let component: EditMakeComponent;
  let fixture: ComponentFixture<EditMakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
