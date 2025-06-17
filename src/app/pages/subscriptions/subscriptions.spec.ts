import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subscriptions } from './subscriptions';

describe('Subscriptions', () => {
  let component: Subscriptions;
  let fixture: ComponentFixture<Subscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subscriptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subscriptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
