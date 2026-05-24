import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TrabajadorService } from '../../../services/trabajador.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Trabajador } from '../../../model/trabajador';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-trabajador-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './trabajador-edit.component.html',
  styleUrl: './trabajador-edit.component.css',
})
export class TrabajadorEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly trabajadorService = inject(TrabajadorService);

  protected $form = signal(new FormGroup({
    idTrabajador: new FormControl<number | null>(null),
    nombre: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
    apellido: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
    cargo: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
    telefono: new FormControl<string>('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    estadoTrabajador: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });

  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());
  protected $f = computed(() => this.$form().controls);

  constructor() {

    effect(() => {

      const id = this.$id();

      if(id){

        this.trabajadorService.findById(id)
          .subscribe(data => this.$form().patchValue(data));

      }

    });

  }

  operate(){

    const form = this.$form();
    const isEdit = this.$isEdit();

    if(form.invalid) return;

    const trabajador: Trabajador = form.value as Trabajador;

    const operation$ = isEdit
      ? this.trabajadorService.update(trabajador.idTrabajador!, trabajador)
      : this.trabajadorService.save(trabajador);

    operation$.pipe(
      switchMap(() => this.trabajadorService.findAll()),
      tap(data => this.trabajadorService.setListChange(data)),
      tap(() => this.trabajadorService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/trabajador']);
    });

  }

}