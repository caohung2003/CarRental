import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCarDetailComponent } from './form-car-detail.component';

describe('FormCarDetailComponent', () => {
  let component: FormCarDetailComponent;
  let fixture: ComponentFixture<FormCarDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCarDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCarDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
