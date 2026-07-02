import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecursoService } from '../../../services/recurso.service';
import { ProveedorService } from '../../../services/proveedor.service'; 
import { Proveedor } from '../../../model/proveedor';
import { toSignal } from '@angular/core/rxjs-interop';
import { Recurso } from '../../../model/recurso';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-recurso-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './recurso-edit.component.html',
  styleUrl: './recurso-edit.component.css'
})
export class RecursoEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recursoService = inject(RecursoService);
  private readonly proveedorService = inject(ProveedorService);

  protected $proveedoresList = signal<Proveedor[]>([]);

  protected $form = signal(new FormGroup({
    idRecurso: new FormControl<number | null>(null),
    proveedor: new FormControl<any>(null, [Validators.required]), 
    nombreRecurso: new FormControl<string>('', [Validators.required]),
    tipoRecurso: new FormControl<string>('', [Validators.required]),
    cantidadRecurso: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    unidadMedidaRecurso: new FormControl<string>('', [Validators.required]),
    costoRecurso: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    fechaIngresoRecurso: new FormControl<string>('', [Validators.required]),
    estadoRecurso: new FormControl<boolean>(true, [Validators.required])
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());
  protected $f = computed(() => this.$form().controls); 


  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idProveedor === o2.idProveedor : o1 === o2;
  }

  constructor() {
    this.proveedorService.findAll().subscribe(data => this.$proveedoresList.set(data));

    effect(() => {
      const id = this.$id();
      if (id) {
        this.recursoService.findById(id).subscribe(data => {
          
          let fechaFormateada = '';
          if (data.fechaIngresoRecurso) {
            if (Array.isArray(data.fechaIngresoRecurso)) {
              const [year, month, day] = data.fechaIngresoRecurso;
              fechaFormateada = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            } else if (typeof data.fechaIngresoRecurso === 'string') {
              fechaFormateada = (data.fechaIngresoRecurso as string).split('T')[0];
            }
          }

          this.$form().patchValue({
            idRecurso: data.idRecurso,
            proveedor: data.proveedor, 
            nombreRecurso: data.nombreRecurso,
            tipoRecurso: data.tipoRecurso,
            cantidadRecurso: data.cantidadRecurso,
            unidadMedidaRecurso: data.unidadMedidaRecurso,
            costoRecurso: data.costoRecurso,
            fechaIngresoRecurso: fechaFormateada,
            estadoRecurso: data.estadoRecurso,
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

    const recurso: any = {
      idProveedor: formValue.proveedor?.idProveedor, 
      nombreRecurso: formValue.nombreRecurso,
      tipoRecurso: formValue.tipoRecurso,
      cantidadRecurso: formValue.cantidadRecurso,
      unidadMedidaRecurso: formValue.unidadMedidaRecurso,
      costoRecurso: formValue.costoRecurso,
      fechaIngresoRecurso: formValue.fechaIngresoRecurso,
      estadoRecurso: formValue.estadoRecurso,
    };

    if (isEdit) {
      recurso.idRecurso = formValue.idRecurso;
    }

    const operation$ = isEdit
      ? this.recursoService.update(recurso.idRecurso!, recurso)
      : this.recursoService.save(recurso);

    operation$.pipe(
      switchMap(() => this.recursoService.findAll()),
      tap(data => this.recursoService.setListChange(data)),
      tap(() => this.recursoService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'REGISTRADO'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/recurso']);
    });
  }
}