import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PagoService } from '../../../services/pago.service';
import { MetodoPagoService } from '../../../services/metodopago.service';
import { MetodoPago } from '../../../model/metodopago';
import { toSignal } from '@angular/core/rxjs-interop';
import { Pago } from '../../../model/pago';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-pago-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './pago-edit.component.html',
  styleUrl: './pago-edit.component.css',
})
export class PagoEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pagoService = inject(PagoService);
  private readonly metodoPagoService = inject(MetodoPagoService);

  protected $metodosPagoList = signal<MetodoPago[]>([]);

  protected $form = signal(new FormGroup({
    idPago: new FormControl<number | null>(null),
    metodoPago: new FormControl<any>(null, [Validators.required]),
    monto: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    fechaPago: new FormControl<string>('', [Validators.required]),
    concepto: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    comprobante: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    estadoPago: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());
  protected $f = computed(() => this.$form().controls);

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idMetodoPago === o2.idMetodoPago : o1 === o2;
  }

  constructor() {
    this.metodoPagoService.findAll().subscribe(data => this.$metodosPagoList.set(data));

    effect(() => {
      const id = this.$id();
      if (id) {
        this.pagoService.findById(id).subscribe(data => {
          let fechaFormateada = '';
          if (data.fechaPago) {
            if (Array.isArray(data.fechaPago)) {
              const [year, month, day] = data.fechaPago;
              fechaFormateada = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            } else if (typeof data.fechaPago === 'string') {
              fechaFormateada = (data.fechaPago as string).split('T')[0];
            }
          }

          this.$form().patchValue({
            idPago: data.idPago,
            metodoPago: data.metodoPago,
            monto: data.monto,
            fechaPago: fechaFormateada,
            concepto: data.concepto,
            comprobante: data.comprobante,
            estadoPago: data.estadoPago,
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

  const pago: any = {
    idMetodoPago: formValue.metodoPago?.idMetodoPago,  
    monto: formValue.monto,
    fechaPago: formValue.fechaPago,
    concepto: formValue.concepto,
    comprobante: formValue.comprobante,
    estadoPago: formValue.estadoPago,
  };

  if (isEdit) {
    pago.idPago = formValue.idPago;
  }

  const operation$ = isEdit
    ? this.pagoService.update(pago.idPago!, pago)
    : this.pagoService.save(pago);

  operation$.pipe(
    switchMap(() => this.pagoService.findAll()),
    tap(data => this.pagoService.setListChange(data)),
    tap(() => this.pagoService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'REGISTRADO'))
  )
  .subscribe(() => {
    this.router.navigate(['/pages/pago']);
  });
}
}