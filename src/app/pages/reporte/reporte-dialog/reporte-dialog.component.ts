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

@Component({
  selector: 'app-reporte-dialog',
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

  // Definición del formulario reactivo encapsulado en una Señal
  protected $form = signal(new FormGroup({
    idReporte: new FormControl<number | null>(null),
    titulo: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
    tipoReporte: new FormControl<string>('', [Validators.required]),
    fechaGeneracion: new FormControl<string>('', [Validators.required]),
    contenido: new FormControl<string>('', [Validators.required]),
    generadoPor: new FormControl<string>('', [Validators.required]),
    estadoReporte: new FormControl<boolean>(true, [Validators.required]),
  }));

  // Evaluación limpia de si es edición basándonos en la data inyectada
  protected $isEdit = computed(() => !!this.data && this.data.idReporte > 0);

  // Helper seguro para leer los controles desde el HTML sin romper el ciclo de vida
  protected getControl(name: string) {
    return this.$form().get(name);
  }

  constructor() {
    // Si la data existe (Edición), rellenamos el formulario inmediatamente
    if (this.data) {
      this.$form().patchValue(this.data);
    }
  }

  operate() {
    const form = this.$form();
    if (form.invalid) return;

    const reporte: Reporte = form.value as Reporte;
    const isEdit = this.$isEdit();
    const msg = isEdit ? 'ACTUALIZADO' : 'REGISTRADO';

    const operation$ = isEdit
      ? this.reporteService.update(reporte.idReporte, reporte)
      : this.reporteService.save(reporte);

    operation$.pipe(
      switchMap(() => this.reporteService.findAll()),
      tap(data => this.reporteService.setListChange(data)),
      tap(() => this.reporteService.setMessageChange(msg))
    )
    .subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}