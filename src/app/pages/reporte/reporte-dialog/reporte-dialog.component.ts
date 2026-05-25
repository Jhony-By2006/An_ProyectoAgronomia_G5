import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReporteService } from '../../../services/reporte.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { ReporteService } from '../../../services/reporte.service';
import { Reporte } from '../../../model/reporte';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-reporte-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
  selector: 'app-reporte-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './reporte-dialog.component.html',
  styleUrl: './reporte-dialog.component.css'
})
export class ReporteEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reporteService = inject(ReporteService);

  // Formulario reactivo como Signal adaptado a las propiedades de tu clase Reporte
  protected $form = signal(new FormGroup({
    idReporte: new FormControl<number | null>(null),
    titulo: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    tipoReporte: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
    fechaGeneracion: new FormControl<string>('', [Validators.required]),
    contenido: new FormControl<string>('', [Validators.required]),
    generadoPor: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    estadoReporte: new FormControl<boolean>(true, { nonNullable: true }),
  }));

  // Captura el ID de los parámetros de la URL usando Signals
  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id()); // true si edita, false si crea
  protected $f = computed(() => this.$form().controls); // Atajo para validaciones en el HTML

  constructor() {
    // Si cambia el ID en la URL, cargamos el reporte correspondiente
    effect(() => {
      const id = this.$id();
      if(id){
        this.reporteService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  // Método unificado para guardar (Create) o actualizar (Update)
  operate(){
    const form = this.$form();
    const isEdit = this.$isEdit();
    
    if(form.invalid) return;

    const reporte: Reporte = form.value as Reporte;

    // Ejecuta la operación correspondiente usando el ID del reporte
    const operation$ = isEdit 
      ? this.reporteService.update(reporte.idReporte!, reporte) 
      : this.reporteService.save(reporte);

    operation$.pipe(
      switchMap(() => this.reporteService.findAll()),
      tap(data => this.reporteService.setListChange(data)),
      tap(() => this.reporteService.setMessageChange(isEdit ? 'MODIFICADO' : 'CREADO'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/reporte']); // Asegúrate de que esta sea tu ruta de listado
    });
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
