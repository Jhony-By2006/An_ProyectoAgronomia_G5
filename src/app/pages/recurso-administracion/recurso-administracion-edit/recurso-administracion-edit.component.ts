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

@Component({
  selector: 'app-recurso-administracion-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
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

  protected $form = signal(new FormGroup({
    idRecursoAdministracion: new FormControl<number | null>(null),
    // El objeto recurso se maneja enviando solo el idRecurso anidado
    recurso: new FormGroup({
      idRecurso: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
    }),
    fechaRecepcion: new FormControl<string>('', [Validators.required]),
    cantidadRecibida: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    observaciones: new FormControl<string>('', [Validators.maxLength(300)]),
    estadoRecursoA: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());
  protected $f = computed(() => this.$form().controls);

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.recursoAdministracionService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate() {
    const form = this.$form();
    const isEdit = this.$isEdit();

    if (form.invalid) return;

    const recurso: RecursoAdministracion = form.value as RecursoAdministracion;

    const operation$ = isEdit
      ? this.recursoAdministracionService.update(recurso.idRecursoAdministracion!, recurso)
      : this.recursoAdministracionService.save(recurso);

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