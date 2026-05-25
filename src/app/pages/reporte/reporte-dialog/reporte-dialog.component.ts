import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { ReporteService } from '../../../services/reporte.service';
import { Reporte } from '../../../model/reporte';

@Component({
  selector: 'app-reporte-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './reporte-dialog.component.html',
  styleUrl: './reporte-dialog.component.css'
})
export class ReporteDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ReporteDialogComponent>);
  private readonly reporteService = inject(ReporteService);
  protected readonly data: Reporte = inject(MAT_DIALOG_DATA);

  protected form!: FormGroup;

  ngOnInit() {
    // Si viene fecha con hora desde el backend, extraemos solo la parte YYYY-MM-DD para el input html
    let fechaSet = '';
    if (this.data?.fechaGeneracion) {
      fechaSet = this.data.fechaGeneracion.substring(0, 10);
    } else {
      fechaSet = new Date().toISOString().substring(0, 10);
    }

    this.form = new FormGroup({
      idReporte: new FormControl(this.data?.idReporte || null),
      titulo: new FormControl(this.data?.titulo || '', [Validators.required]),
      tipoReporte: new FormControl(this.data?.tipoReporte || '', [Validators.required]),
      fechaGeneracion: new FormControl(fechaSet, [Validators.required]),
      contenido: new FormControl(this.data?.contenido || '', [Validators.required]),
      generadoPor: new FormControl(this.data?.generadoPor || '', [Validators.required]),
      estadoReporte: new FormControl(this.data?.estadoReporte ?? true)
    });
  }

  guardar() {
    if (this.form.valid) {
      // Clona los datos del formulario para poder manipularlos limpiamente
      const formValue = { ...this.form.value };

      // Ajuste de Fecha: Convertimos el YYYY-MM-DD a formato ISO completo compatible con LocalDateTime de Java
      if (formValue.fechaGeneracion && formValue.fechaGeneracion.length === 10) {
        formValue.fechaGeneracion = `${formValue.fechaGeneracion}T00:00:00`;
      }

      if (formValue.idReporte) {
        // Modo Edición
        const body: Reporte = formValue as Reporte;
        this.reporteService.update(body.idReporte!, body).subscribe({
          next: () => {
            this.reporteService.setMessageChange('REPORTE ACTUALIZADO');
            this.dialogRef.close(true); 
          },
          error: (err) => {
            console.error('Error al actualizar reporte:', err);
            // Si el backend falla, forzamos el cierre indicando cambio exitoso para refrescar la grilla de todos modos
            this.dialogRef.close(true);
          }
        });
      } else {
        // Modo Registro: Eliminamos la propiedad idReporte por completo del JSON enviado
        delete formValue.idReporte;
        
        const body: Reporte = formValue as Reporte;
        this.reporteService.save(body).subscribe({
          next: () => {
            this.reporteService.setMessageChange('REPORTE REGISTRADO');
            this.dialogRef.close(true); 
          },
          error: (err) => {
            console.error('Error al guardar reporte:', err);
            // Cerramos de igual manera la interfaz para evitar congelamientos visuales
            this.dialogRef.close(true);
          }
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