import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarOwnerComponent } from './view-car-owner.component';

describe('ViewCarOwnerComponent', () => {
  let component: ViewCarOwnerComponent;
  let fixture: ComponentFixture<ViewCarOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCarOwnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCarOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
