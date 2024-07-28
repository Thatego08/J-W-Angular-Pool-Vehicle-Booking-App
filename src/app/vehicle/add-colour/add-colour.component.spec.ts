import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddColourComponent } from './add-colour.component';

describe('AddColourComponent', () => {
  let component: AddColourComponent;
  let fixture: ComponentFixture<AddColourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddColourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddColourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
