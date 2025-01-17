import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarCardComponent } from './list-car-card.component';

describe('ListCarCardComponent', () => {
  let component: ListCarCardComponent;
  let fixture: ComponentFixture<ListCarCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCarCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
