import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingViewCarComponent } from './rating-view-car.component';

describe('RatingViewCarComponent', () => {
  let component: RatingViewCarComponent;
  let fixture: ComponentFixture<RatingViewCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingViewCarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatingViewCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
