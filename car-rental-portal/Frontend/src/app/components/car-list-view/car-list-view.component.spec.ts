import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarListViewComponent } from './car-list-view.component';

describe('CarListViewComponent', () => {
  let component: CarListViewComponent;
  let fixture: ComponentFixture<CarListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarListViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
