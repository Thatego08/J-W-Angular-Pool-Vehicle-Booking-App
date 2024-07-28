import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditColourComponent } from './edit-colour.component';

describe('EditColourComponent', () => {
  let component: EditColourComponent;
  let fixture: ComponentFixture<EditColourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditColourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditColourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
