import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingUserComponent } from './rating-user.component';

describe('RatingUserComponent', () => {
  let component: RatingUserComponent;
  let fixture: ComponentFixture<RatingUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
