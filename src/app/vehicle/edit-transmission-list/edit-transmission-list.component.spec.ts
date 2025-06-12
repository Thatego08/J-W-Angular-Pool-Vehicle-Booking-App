import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTransmissionListComponent } from './edit-transmission-list.component';

describe('EditTransmissionListComponent', () => {
  let component: EditTransmissionListComponent;
  let fixture: ComponentFixture<EditTransmissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTransmissionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTransmissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
