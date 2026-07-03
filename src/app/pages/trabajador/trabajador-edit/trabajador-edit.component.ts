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
import { switchMap, tap } from 'rxjs';

export const REGEX_TRABAJADOR = { 
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
  protected readonly data: any = inject(MAT_DIALOG_DATA);

  protected form!: FormGroup;

  ngOnInit() {
    let fechaInicial = null;
    if (this.data?.fechaContratoT) {
      fechaInicial = this.data.fechaContratoT.split('T')[0];
    }

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

  private fechaNoFuturaValidator(control: FormControl) {
    if (!control.value) return null;
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada > hoy ? { fechaFutura: true } : null;
  }

  guardar() {
    if (this.form.valid) {
      const formValue: any = this.form.value;
      const isEdit = !!formValue.idTrabajador;
      const msg = isEdit ? 'TRABAJADOR ACTUALIZADO' : 'TRABAJADOR REGISTRADO';

      const operation$ = isEdit
        ? this.trabajadorService.update(formValue.idTrabajador, formValue)
        : this.trabajadorService.save(formValue);

      operation$.pipe(
        switchMap(() => this.trabajadorService.findAll()),
        tap(data => this.trabajadorService.setListChange(data)),
        tap(() => this.trabajadorService.setMessageChange(msg))
      )
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Error en el servidor:', err)
      });
    } else {
      this.form.markAllAsTouched(); 
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}