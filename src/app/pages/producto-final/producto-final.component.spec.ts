import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoFinalComponent } from './producto-final.component';

describe('ProductoFinalComponent', () => {
  let component: ProductoFinalComponent;
  let fixture: ComponentFixture<ProductoFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoFinalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoFinalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
