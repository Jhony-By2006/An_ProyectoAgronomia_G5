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
    nombreProdI: new FormControl<string>('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    descripcionProdI: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    cantidadInicialProdI: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    unidadMedidaProdI: new FormControl<string>('', [Validators.required, Validators.maxLength(30)]),
    costoUnitarioProdI: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    fechaIngresoProdI: new FormControl<string>('', [Validators.required]),
    proveedorOrigenProdI: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    estadoProdI: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());
  protected $f = computed(() => this.$form().controls);

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

    if (form.invalid) return;

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