import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Proveedor } from '../../../model/proveedor';
import { switchMap, tap } from 'rxjs';

// ── (Proveedor) ──
const NOMBRE_REGEX = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,&\-\s]{3,80}$/;
const RUC_REGEX = /^[0-9]{11}$/;
const DIRECCION_REGEX = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,°#\-\s]{5,150}$/;
const TELEFONO_REGEX = /^[0-9]{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{1,63})@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z]{2,8}$/;

@Component({
  selector: 'app-proveedor-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, 
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

  protected $form = signal(new FormGroup({
    idProveedor: new FormControl<number | null>(null),
    nombreProveedor: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(NOMBRE_REGEX),
      Validators.minLength(3),
      Validators.maxLength(80)
    ]),
    apellidoProveedor: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(NOMBRE_REGEX),
      Validators.minLength(3),
      Validators.maxLength(70)
    ]),
    rucProveedor: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(RUC_REGEX),
      Validators.minLength(11),
      Validators.maxLength(11)
    ]),
    direccionProveedor: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(DIRECCION_REGEX),
      Validators.maxLength(150)
    ]),
    telefonoProveedor: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(TELEFONO_REGEX),
      Validators.minLength(9),
      Validators.maxLength(9)
    ]),
    emailProveedor: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(EMAIL_REGEX)
    ]),
    estadoProveedor: new FormControl<boolean | null>(true, [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());
  protected $f = computed(() => this.$form().controls);

  constructor() {
    effect(() => {
      const id = this.$id();
      if(id){
        this.proveedorService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate(){
    const form = this.$form();
    const isEdit = this.$isEdit();
    
    if(form.invalid) {
      form.markAllAsTouched();
      alert('Revisa los campos, hay datos inválidos (formato incorrecto o vacíos).');
      return;
    }

    const proveedor: Proveedor = form.value as Proveedor;

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