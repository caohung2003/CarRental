import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingCarComponent } from './rating-car.component';

describe('RatingCarComponent', () => {
  let component: RatingCarComponent;
  let fixture: ComponentFixture<RatingCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingCarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatingCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
