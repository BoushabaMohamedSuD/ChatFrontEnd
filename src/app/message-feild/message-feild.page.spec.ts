import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFeildPage } from './message-feild.page';

describe('MessageFeildPage', () => {
  let component: MessageFeildPage;
  let fixture: ComponentFixture<MessageFeildPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageFeildPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageFeildPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
