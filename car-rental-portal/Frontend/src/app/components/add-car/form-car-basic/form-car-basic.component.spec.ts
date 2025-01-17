import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCarBasicComponent } from './form-car-basic.component';

describe('FormCarBasicComponent', () => {
  let component: FormCarBasicComponent;
  let fixture: ComponentFixture<FormCarBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCarBasicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCarBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
