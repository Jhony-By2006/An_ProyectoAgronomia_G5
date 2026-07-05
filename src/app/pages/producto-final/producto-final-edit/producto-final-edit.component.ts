import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoFinalService } from '../../../services/producto-final.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductoFinal } from '../../../model/producto-final';
import { switchMap, tap } from 'rxjs';

// ── (ProductoFinal) ──
const NOMBRE_REGEX = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,\-\s]{3,100}$/;
const DESCRIPCION_REGEX = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,°@\-\s]{5,250}$/;
const UNIDAD_REGEX = /^[a-zA-ZÀ-ÿ.\s]{1,20}$/;
const CANTIDAD_MIN = 1;
const CANTIDAD_MAX = 100000;
const PRECIO_MIN = 0.01;
const PRECIO_MAX = 1000000;

@Component({
  selector: 'app-producto-final-edit',
  imports: [
   ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './producto-final-edit.component.html',
  styleUrl: './producto-final-edit.component.css',
})
export class ProductoFinalEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productoFinalService = inject(ProductoFinalService);

  protected $form = signal(new FormGroup({
    idProductoFinal: new FormControl<number | null>(null),
    nombreProdF: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(NOMBRE_REGEX),
      Validators.maxLength(100)
    ]),
    descripcionProdF: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(DESCRIPCION_REGEX),
      Validators.maxLength(250)
    ]),
    cantidadProducidaProdF: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(CANTIDAD_MIN),
      Validators.max(CANTIDAD_MAX)
    ]),
    unidadMedidaProdF: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(UNIDAD_REGEX)
    ]),
    precioVentaProdF: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(PRECIO_MIN),
      Validators.max(PRECIO_MAX)
    ]),
    fechaProduccionProdF: new FormControl<string>('', [
      Validators.required,
      this.fechaNoFuturaValidator
    ]),
    estadoProdF: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  protected getControl(name: string) {
    return this.$form().get(name);
  }

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
        this.productoFinalService.findById(id).subscribe(data => this.$form().patchValue(data));
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

    const producto: ProductoFinal = form.value as ProductoFinal;

    const operation$ = isEdit
      ? this.productoFinalService.update(producto.idProductoFinal!, producto)
      : this.productoFinalService.save(producto);

    operation$.pipe(
      switchMap(() => this.productoFinalService.findAll()),
      tap(data => this.productoFinalService.setListChange(data)),
      tap(() => this.productoFinalService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/producto-final']);
    });
  }
}