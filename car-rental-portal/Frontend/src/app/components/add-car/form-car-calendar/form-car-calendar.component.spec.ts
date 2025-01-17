import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCarCalendarComponent } from './form-car-calendar.component';

describe('FormCarCalendarComponent', () => {
  let component: FormCarCalendarComponent;
  let fixture: ComponentFixture<FormCarCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCarCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCarCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
