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
  standalone: true,
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

  // Formulario Reactivo configurado con las propiedades de ProductoFinal
  protected $form = signal(new FormGroup({
    idProductoFinal: new FormControl<number | null>(null),
    idProductoInicial: new FormControl<number | null>(null), // Añadido según las columnas de tu vista
    nombreProductoFinal: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
    descripcionProductoFinal: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
    precioProductoFinal: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    stockProductoFinal: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    estadoProductoFinal: new FormControl<boolean>(true, { nonNullable: true }),
  }));

  // Parámetros de la URL administrados mediante un Signal reactivo
  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id()); // true si estamos editando un id existente, false si es nuevo
  protected $f = computed(() => this.$form().controls); // Atajo limpio para el HTML

  constructor() {
    // Si el ID cambia o se detecta en la URL, se cargan los datos automáticamente para editar
    effect(() => {
      const id = this.$id();
      if (id) {
        this.productoFinalService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  // Operación unificada para Guardar (Save) o Actualizar (Update)
  operate() {
    const form = this.$form();
    const isEdit = this.$isEdit();
    
    if (form.invalid) return;

    const productoFinal: ProductoFinal = form.value as ProductoFinal;

    // Ejecuta dinámicamente la operación requerida en el backend
    const operation$ = isEdit 
      ? this.productoFinalService.update(productoFinal.idProductoFinal!, productoFinal) 
      : this.productoFinalService.save(productoFinal);

    operation$.pipe(
      switchMap(() => this.productoFinalService.findAll()),
      tap(data => this.productoFinalService.setListChange(data)),
      tap(() => this.productoFinalService.setMessageChange(isEdit ? 'MODIFICADO' : 'CREADO'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/producto-final']);
    });
  }
}