import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecursoAdministracionService } from '../../../services/recurso-administracion.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RecursoAdministracion } from '../../../model/recurso-administracion';
import { switchMap, tap } from 'rxjs';
import { RecursoService } from '../../../services/recurso.service';
import { Recurso } from '../../../model/recurso';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-recurso-administracion-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './recurso-administracion-edit.component.html',
  styleUrl: './recurso-administracion-edit.component.css',
})
export class RecursoAdministracionEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recursoAdministracionService = inject(RecursoAdministracionService);
  private readonly recursoService = inject(RecursoService);

  protected $recursosList = signal<Recurso[]>([]);

  protected $form = signal(new FormGroup({
    idRecursoAdministracion: new FormControl<number | null>(null),
    recurso: new FormControl<any>(null, [Validators.required]),
    fechaRecepcion: new FormControl<string>('', [Validators.required]),
    cantidadRecibida: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    observaciones: new FormControl<string>('', [Validators.maxLength(300)]),
    estadoRecursoA: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());
  protected $f = computed(() => this.$form().controls);

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idRecurso === o2.idRecurso : o1 === o2;
  }

  constructor() {
    this.recursoService.findAll().subscribe(data => this.$recursosList.set(data));

    effect(() => {
      const id = this.$id();
      if (id) {
        this.recursoAdministracionService.findById(id).subscribe(data => {
          let fechaFormateada = '';
          if (data.fechaRecepcion) {
            if (Array.isArray(data.fechaRecepcion)) {
              const [year, month, day] = data.fechaRecepcion;
              fechaFormateada = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            } else if (typeof data.fechaRecepcion === 'string') {
              fechaFormateada = (data.fechaRecepcion as string).split('T')[0];
            }
          }

          this.$form().patchValue({
            idRecursoAdministracion: data.idRecursoAdministracion,
            recurso: data.recurso,
            fechaRecepcion: fechaFormateada,
            cantidadRecibida: data.cantidadRecibida,
            observaciones: data.observaciones,
            estadoRecursoA: data.estadoRecursoA,
          });
        });
      }
    });
  }

  operate() {
    const form = this.$form();
    const isEdit = this.$isEdit();

    if (form.invalid) return;

    const formValue = form.value;
    const payload: any = {
      idRecurso: formValue.recurso?.idRecurso,
      fechaRecepcion: formValue.fechaRecepcion,
      cantidadRecibida: formValue.cantidadRecibida ? Number(formValue.cantidadRecibida) : null,
      observaciones: formValue.observaciones,
      estadoRecursoA: formValue.estadoRecursoA,
    };

    if (isEdit) payload.idRecursoAdministracion = formValue.idRecursoAdministracion;

    const operation$ = isEdit
      ? this.recursoAdministracionService.update(payload.idRecursoAdministracion!, payload)
      : this.recursoAdministracionService.save(payload);

    operation$.pipe(
      switchMap(() => this.recursoAdministracionService.findAll()),
      tap(data => this.recursoAdministracionService.setListChange(data)),
      tap(() => this.recursoAdministracionService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/recurso-administracion']);
    });
  }
}
