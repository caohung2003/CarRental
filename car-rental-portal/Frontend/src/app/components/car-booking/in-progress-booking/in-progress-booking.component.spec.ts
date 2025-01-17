import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressBookingComponent } from './in-progress-booking.component';

describe('InProgressBookingComponent', () => {
  let component: InProgressBookingComponent;
  let fixture: ComponentFixture<InProgressBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InProgressBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InProgressBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
