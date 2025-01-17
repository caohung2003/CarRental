import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveStepComponent } from './approve-step.component';

describe('ApproveStepComponent', () => {
  let component: ApproveStepComponent;
  let fixture: ComponentFixture<ApproveStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApproveStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
