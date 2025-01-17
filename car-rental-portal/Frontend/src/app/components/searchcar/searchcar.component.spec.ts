import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchcarComponent } from './searchcar.component';

describe('FormComponent', () => {
  let component: SearchcarComponent;
  let fixture: ComponentFixture<SearchcarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchcarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchcarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
