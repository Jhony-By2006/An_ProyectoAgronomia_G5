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

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
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
    this.form = new FormGroup({
      idTrabajador: new FormControl(this.data?.idTrabajador || null),
      nombreTrabajador: new FormControl(this.data?.nombreTrabajador || '', [Validators.required]),
      apellidosTrabajador: new FormControl(this.data?.apellidosTrabajador || '', [Validators.required]),
      dni: new FormControl(this.data?.dni || '', [Validators.required, Validators.maxLength(15)]),
      cargo: new FormControl(this.data?.cargo || ''),
      telefono: new FormControl(this.data?.telefono || ''),
      email: new FormControl(this.data?.email || '', [Validators.email]),
      fechaContratoT: new FormControl(
        this.data?.fechaContratoT ? new Date(this.data.fechaContratoT) : null
      ),
      estado: new FormControl(this.data?.estado ?? true)
    });
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
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}