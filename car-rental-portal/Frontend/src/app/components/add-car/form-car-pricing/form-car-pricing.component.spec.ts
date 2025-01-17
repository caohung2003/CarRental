import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCarPricingComponent } from './form-car-pricing.component';

describe('FormCarPricingComponent', () => {
  let component: FormCarPricingComponent;
  let fixture: ComponentFixture<FormCarPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCarPricingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCarPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
