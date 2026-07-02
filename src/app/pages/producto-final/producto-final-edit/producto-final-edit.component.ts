import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoFinalService } from '../../../services/producto-final.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductoFinal } from '../../../model/producto-final';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-producto-final-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
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
    nombreProdF: new FormControl<string>('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    descripcionProdF: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    cantidadProducidaProdF: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    unidadMedidaProdF: new FormControl<string>('', [Validators.required, Validators.maxLength(30)]),
    precioVentaProdF: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    fechaProduccionProdF: new FormControl<string>('', [Validators.required]),
    estadoProdF: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  
  protected getControl(name: string) {
    return this.$form().get(name);
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

    if (form.invalid) return;

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