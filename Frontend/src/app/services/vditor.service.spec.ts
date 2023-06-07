import { TestBed } from "@angular/core/testing";

import { VditorService } from "./vditor.service";

describe("VditorService", () => {
  let service: VditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VditorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
