import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageCustomersComponent } from './homepage-customers.component';

describe('HomepageCustomersComponent', () => {
  let component: HomepageCustomersComponent;
  let fixture: ComponentFixture<HomepageCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
