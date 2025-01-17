import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedBookingComponent } from './completed-booking.component';

describe('CompletedBookingComponent', () => {
  let component: CompletedBookingComponent;
  let fixture: ComponentFixture<CompletedBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompletedBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
