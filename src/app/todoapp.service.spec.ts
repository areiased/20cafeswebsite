import { TestBed } from '@angular/core/testing';

import { TodoappService } from './todoapp.service';

describe('TodoappService', () => {
  let service: TodoappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
