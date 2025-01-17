import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewrateComponent } from './viewrate.component';

describe('ViewrateComponent', () => {
  let component: ViewrateComponent;
  let fixture: ComponentFixture<ViewrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewrateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
