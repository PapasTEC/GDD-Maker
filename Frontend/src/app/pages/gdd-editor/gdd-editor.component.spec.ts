import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GddEditorComponent } from './gdd-editor.component';

describe('GddEditorComponent', () => {
  let component: GddEditorComponent;
  let fixture: ComponentFixture<GddEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GddEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GddEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
