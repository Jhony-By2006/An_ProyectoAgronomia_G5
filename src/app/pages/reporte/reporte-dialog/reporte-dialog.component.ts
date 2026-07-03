import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReporteService } from '../../../services/reporte.service'; 
import { Reporte } from '../../../model/reporte'; 
import { switchMap, tap } from 'rxjs';

export const REGEX_REPORTE = {
  titulo: /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,°\-\s]{5,100}$/,
  tipoReporte: /^[a-zA-ZÀ-ÿ\s]{3,40}$/,
  contenido: /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,°@\-\s]{10,2000}$/,
  generadoPor: /^[a-zA-ZÀ-ÿ\s]{3,60}$/
};

@Component({
  selector: 'app-reporte-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './reporte-dialog.component.html',
  styleUrl: './reporte-dialog.component.css',
})
export class ReporteDialogComponent {
  private readonly reporteService = inject(ReporteService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ReporteDialogComponent>);

  protected $form = signal(new FormGroup({
    idReporte: new FormControl<number | null>(null),
    titulo: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(REGEX_REPORTE.titulo),
      Validators.maxLength(100)
    ]),
    tipoReporte: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(REGEX_REPORTE.tipoReporte),
      Validators.maxLength(40)
    ]),
    fechaGeneracion: new FormControl<string>('', [
      Validators.required,
      this.fechaNoFuturaValidator
    ]),
    contenido: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(REGEX_REPORTE.contenido),
      Validators.maxLength(2000)
    ]),
    generadoPor: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(REGEX_REPORTE.generadoPor),
      Validators.maxLength(60)
    ]),
    estadoReporte: new FormControl<boolean>(true, [Validators.required]),
  }));

  protected $isEdit = computed(() => !!this.data && this.data.idReporte > 0);

  protected getControl(name: string) {
    return this.$form().get(name);
  }

  constructor() {
    if (this.data) {
      this.$form().patchValue(this.data);
    }
  }

  private fechaNoFuturaValidator(control: FormControl) {
    if (!control.value) return null;
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada > hoy ? { fechaFutura: true } : null;
  }

  operate() {
    const form = this.$form();

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const reporte: any = form.value;
    const isEdit = this.$isEdit();
    const msg = isEdit ? 'REPORTE ACTUALIZADO' : 'REPORTE REGISTRADO';

    const operation$ = isEdit
      ? this.reporteService.update(reporte.idReporte, reporte)
      : this.reporteService.save(reporte);

    operation$.pipe(
      switchMap(() => this.reporteService.findAll()),
      tap(data => this.reporteService.setListChange(data)),
      tap(() => this.reporteService.setMessageChange(msg))
    )
    .subscribe({
      next: () => this.close(),
      error: (err) => console.error('Error al procesar el reporte:', err)
    });
  }

  close() {
    this.dialogRef.close();
  }
}