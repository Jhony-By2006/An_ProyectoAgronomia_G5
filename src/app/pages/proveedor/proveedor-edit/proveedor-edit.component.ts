import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Proveedor } from '../../../model/proveedor';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-proveedor-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './proveedor-edit.component.html',
  styleUrl: './proveedor-edit.component.css',
})
export class ProveedorEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly proveedorService = inject(ProveedorService);

  // Definimos el formulario como un Signal para que Angular rastree sus cambios en tiempo real
  protected $form = signal(new FormGroup({
    idProveedor: new FormControl<number | null>(null),
    nombreProveedor: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
    apellidoProveedor: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
    rucProveedor: new FormControl<string>('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    direccionProveedor: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
    telefonoProveedor: new FormControl<string>('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
    emailProveedor: new FormControl<string>('', [Validators.required, Validators.email]),
    estadoProveedor: new FormControl<boolean | null>(true),
  }));

  // Convertimos los parámetros de la URL (el ID) a un Signal para saber si estamos editando o creando
  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id()); // Si hay ID, estamos editando (true). Si no, creando (false)
  protected $f = computed(() => this.$form().controls); // Acceso rápido a los controles para el HTML

  constructor() {
    // El effect se ejecuta cada vez que el ID cambia; ideal para cargar datos al editar
    effect(() => {
      const id = this.$id();
      if(id){
        // Si hay ID, llamamos al servicio para traer los datos y llenar el form automáticamente
        this.proveedorService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  // Este método unifica Create y Update en uno solo
  operate(){
    const form = this.$form();
    const isEdit = this.$isEdit();
    
    if(form.invalid) return;

    const proveedor: Proveedor = form.value as Proveedor;

    // Aquí usamos el servicio
    const operation$ = isEdit 
      ? this.proveedorService.update(proveedor.idProveedor!, proveedor) 
      : this.proveedorService.save(proveedor);

    operation$.pipe(
      switchMap(() => this.proveedorService.findAll()),
      tap(data => this.proveedorService.setListChange(data)),
      tap(() => this.proveedorService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/proveedor']);
    });
    

  }
  
}