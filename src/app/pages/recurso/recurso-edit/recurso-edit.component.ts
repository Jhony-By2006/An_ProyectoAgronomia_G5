import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecursoService } from '../../../services/recurso.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Recurso } from '../../../model/recurso';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-recurso-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './recurso-edit.component.html',
  styleUrl: './recurso-edit.component.css',
})
export class RecursoEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recursoService = inject(RecursoService);

  protected $form = signal(new FormGroup({
    idRecurso: new FormControl<number | null>(null),
    nombreRecurso: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
    tipoRecurso: new FormControl<string>('', [Validators.required]),
    cantidadRecurso: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    unidadMedidaRecurso: new FormControl<string>('', [Validators.required]),
    costoRecurso: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    fechaIngresoRecurso: new FormControl<string>('', [Validators.required]),
    estadoRecurso: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id()); 
  protected $f = computed(() => this.$form().controls);

  constructor() {
    effect(() => {
      const id = this.$id();
      if(id){
        this.recursoService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate(){
    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.$id();

    if(form.invalid) return;

    const recurso: Recurso = form.value as Recurso;

    const operation$ = isEdit ? this.recursoService.update(id, recurso) : this.recursoService.save(recurso);

    operation$.pipe(
      switchMap(() => this.recursoService.findAll()),
      tap(data => this.recursoService.setListChange(data)),
      tap(() => this.recursoService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/recurso']);
    });
  }
}