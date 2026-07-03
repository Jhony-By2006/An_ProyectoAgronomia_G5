import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoInicialService } from '../../../services/producto-inicial.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductoInicial } from '../../../model/producto-inicial';
import { switchMap, tap } from 'rxjs';

// ── (ProductoInicial) ──
const NOMBRE_REGEX = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,\-\s]{3,100}$/;
const DESCRIPCION_REGEX = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,°@\-\s]{5,250}$/;
const UNIDAD_REGEX = /^[a-zA-ZÀ-ÿ.\s]{1,20}$/;
const PROVEEDOR_ORIGEN_REGEX = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,\-\s]{3,100}$/;
const CANTIDAD_MIN = 1;
const CANTIDAD_MAX = 100000;
const COSTO_MIN = 0.01;
const COSTO_MAX = 1000000;

@Component({
  selector: 'app-producto-inicial-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './producto-inicial-edit.component.html',
  styleUrl: './producto-inicial-edit.component.css',
})
export class ProductoInicialEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productoInicialService = inject(ProductoInicialService);

  protected $form = signal(new FormGroup({
    idProductoInicial: new FormControl<number | null>(null),
    nombreProdI: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(NOMBRE_REGEX),
      Validators.maxLength(100)
    ]),
    descripcionProdI: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(DESCRIPCION_REGEX),
      Validators.maxLength(250)
    ]),
    cantidadInicialProdI: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(CANTIDAD_MIN),
      Validators.max(CANTIDAD_MAX)
    ]),
    unidadMedidaProdI: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(UNIDAD_REGEX)
    ]),
    costoUnitarioProdI: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(COSTO_MIN),
      Validators.max(COSTO_MAX)
    ]),
    fechaIngresoProdI: new FormControl<string>('', [
      Validators.required,
      this.fechaNoFuturaValidator
    ]),
    proveedorOrigenProdI: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(PROVEEDOR_ORIGEN_REGEX),
      Validators.maxLength(100)
    ]),
    estadoProdI: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());
  protected $f = computed(() => this.$form().controls);

  private fechaNoFuturaValidator(control: FormControl) {
    if (!control.value) return null;
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada > hoy ? { fechaFutura: true } : null;
  }

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.productoInicialService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate() {
    const form = this.$form();
    const isEdit = this.$isEdit();

    if (form.invalid) {
      form.markAllAsTouched();
      alert('Revisa los campos, hay datos inválidos (formato incorrecto o vacíos).');
      return;
    }

    const producto: ProductoInicial = form.value as ProductoInicial;

    const operation$ = isEdit
      ? this.productoInicialService.update(producto.idProductoInicial!, producto)
      : this.productoInicialService.save(producto);

    operation$.pipe(
      switchMap(() => this.productoInicialService.findAll()),
      tap(data => this.productoInicialService.setListChange(data)),
      tap(() => this.productoInicialService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/producto-inicial']);
    });
  }
}