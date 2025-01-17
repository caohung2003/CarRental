import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingViewRenterComponent } from './rating-view-renter.component';

describe('RatingViewRenterComponent', () => {
  let component: RatingViewRenterComponent;
  let fixture: ComponentFixture<RatingViewRenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingViewRenterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatingViewRenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
