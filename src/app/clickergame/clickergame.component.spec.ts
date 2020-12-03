import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickergameComponent } from './clickergame.component';

describe('ClickergameComponent', () => {
  let component: ClickergameComponent;
  let fixture: ComponentFixture<ClickergameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClickergameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickergameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
