import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { TrabajadorService } from '../../../services/trabajador.service';
import { Trabajador } from '../../../model/trabajador';

// ── (validaciones) ──
export const REGEX_TRABAJADOR = { // Es nuestro disccionario para las validaciones.
  nombres: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
  apellidos: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
  dni: /^[0-9]{8}$/,
  cargo: /^[a-zA-ZÀ-ÿ\s]{2,40}$/,
  telefono: /^9[0-9]{8}$/,
  email: /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{1,63})@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z]{2,8}$/
};

@Component({
  selector: 'app-trabajador-edit',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './trabajador-edit.component.html',
  styleUrl: './trabajador-edit.component.css'
})
export class TrabajadorEditComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<TrabajadorEditComponent>);
  private readonly trabajadorService = inject(TrabajadorService);
  protected readonly data: Trabajador = inject(MAT_DIALOG_DATA);

  protected form!: FormGroup;

  ngOnInit() {

    let fechaInicial = null;
    if (this.data?.fechaContratoT) {
      fechaInicial = this.data.fechaContratoT.split('T')[0];
    }

    const hoy = new Date().toISOString().split('T')[0];

    this.form = new FormGroup({
      idTrabajador: new FormControl(this.data?.idTrabajador || null),

      nombreTrabajador: new FormControl(this.data?.nombreTrabajador || '', [
        Validators.required,
        Validators.pattern(REGEX_TRABAJADOR.nombres),
        Validators.maxLength(50)
      ]),

      apellidosTrabajador: new FormControl(this.data?.apellidosTrabajador || '', [
        Validators.required,
        Validators.pattern(REGEX_TRABAJADOR.apellidos),
        Validators.maxLength(50)
      ]),

      dni: new FormControl(this.data?.dni || '', [
        Validators.required,
        Validators.pattern(REGEX_TRABAJADOR.dni)
      ]),

      cargo: new FormControl(this.data?.cargo || '', [
        Validators.pattern(REGEX_TRABAJADOR.cargo),
        Validators.maxLength(40)
      ]),

      telefono: new FormControl(this.data?.telefono || '', [
        Validators.pattern(REGEX_TRABAJADOR.telefono)
      ]),

      email: new FormControl(this.data?.email || '', [
        Validators.required,
        Validators.pattern(REGEX_TRABAJADOR.email),
        Validators.maxLength(100)
      ]),

      fechaContratoT: new FormControl(fechaInicial, [
        Validators.required,
        this.fechaNoFuturaValidator
      ]),

      estado: new FormControl(this.data?.estado ?? true)
    });
  }

  // Validador custom: replica validarFechaContrato() del JS de MVC
  private fechaNoFuturaValidator(control: FormControl) {
    if (!control.value) return null;
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada > hoy ? { fechaFutura: true } : null;
  }

  // Helper para mostrar mensajes de error en el HTML
  getError(campo: string): string {
    const control = this.form.get(campo);
    if (!control || !control.touched || control.valid) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('pattern')) {
      const mensajes: Record<string, string> = {
        nombreTrabajador: 'Solo letras y espacios, entre 2 y 50 caracteres.',
        apellidosTrabajador: 'Solo letras y espacios, entre 2 y 50 caracteres.',
        dni: 'El DNI debe tener exactamente 8 dígitos.',
        cargo: 'Solo letras y espacios, entre 2 y 40 caracteres.',
        telefono: 'El teléfono debe iniciar con 9 y tener 9 dígitos.',
        email: 'Ingrese un correo válido (ej: nombre@dominio.com).'
      };
      return mensajes[campo] || 'Formato inválido.';
    }
    if (control.hasError('maxlength')) return 'Excede el máximo de caracteres.';
    if (control.hasError('fechaFutura')) return 'La fecha de contrato no puede ser futura.';

    return '';
  }

  guardar() {
    if (this.form.valid) {
      const formValue: Trabajador = this.form.value as Trabajador;

      if (formValue.idTrabajador) {
        this.trabajadorService.update(formValue.idTrabajador, formValue).subscribe({
          next: () => {
            this.trabajadorService.setMessageChange('TRABAJADOR ACTUALIZADO');
            this.dialogRef.close(true);
          },
          error: (err) => console.error('Error al actualizar:', err)
        });
      } else {
        this.trabajadorService.save(formValue).subscribe({
          next: () => {
            this.trabajadorService.setMessageChange('TRABAJADOR REGISTRADO');
            this.dialogRef.close(true);
          },
          error: (err) => console.error('Error al guardar:', err)
        });
      }
    } else {
      this.form.markAllAsTouched(); 
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}