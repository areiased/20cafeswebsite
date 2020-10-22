import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreeditpageComponent } from './storeeditpage.component';

describe('StoreeditpageComponent', () => {
  let component: StoreeditpageComponent;
  let fixture: ComponentFixture<StoreeditpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreeditpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreeditpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
