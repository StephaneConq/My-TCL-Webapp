import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassagesDetailsComponent } from './passages-details.component';

describe('PassagesDetailsComponent', () => {
  let component: PassagesDetailsComponent;
  let fixture: ComponentFixture<PassagesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassagesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassagesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
