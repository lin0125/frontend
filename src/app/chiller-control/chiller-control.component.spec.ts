import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChillerControlComponent } from './chiller-control.component';

describe('ChillerControlComponent', () => {
  let component: ChillerControlComponent;
  let fixture: ComponentFixture<ChillerControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChillerControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChillerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
