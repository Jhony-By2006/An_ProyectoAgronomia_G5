import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReporteService } from '../../../services/reporte.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Reporte } from '../../../model/reporte';
import { switchMap, tap } from 'rxjs';

@Component({
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
  styleUrl: './reporte-dialog.component.css',
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
  }
}