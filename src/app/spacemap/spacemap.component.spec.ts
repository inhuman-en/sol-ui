import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacemapComponent } from './spacemap.component';

describe('SpacemapComponent', () => {
  let component: SpacemapComponent;
  let fixture: ComponentFixture<SpacemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpacemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpacemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
