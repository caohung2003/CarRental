import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewinfoComponent } from './viewinfo.component';

describe('ViewinforComponent', () => {
  let component: ViewinfoComponent;
  let fixture: ComponentFixture<ViewinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewinfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
