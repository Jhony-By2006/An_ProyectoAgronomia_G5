import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MetodoPagoService } from '../../../services/metodopago.service';
import { switchMap, tap } from 'rxjs';

// Metodo Pago.
const NOMBRE_REGEX = /^[a-zA-ZÀ-ÿ\s]{3,60}$/;
const DESCRIPCION_REGEX = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9.,°@\-\s]{5,200}$/;

@Component({
  selector: 'app-metodopago-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './metodopago-dialog.component.html',
  styleUrl: './metodopago-dialog.component.css',
})
export class MetodoPagoDialogComponent {

  private readonly metodoPagoService = inject(MetodoPagoService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<MetodoPagoDialogComponent>);

  protected $metodoPago = signal({ ...this.data });

  // Exponemos las constantes al HTML
  protected readonly nombrePattern = NOMBRE_REGEX;
  protected readonly descripcionPattern = DESCRIPCION_REGEX;

  private validar(): boolean {
    const metodoPago = this.$metodoPago();
    const nombre = (metodoPago.nombre ?? '').trim();
    const descripcion = (metodoPago.descripcion ?? '').trim();

    if (!nombre || !NOMBRE_REGEX.test(nombre)) {
      alert('El nombre solo debe contener letras y espacios, sin números ni símbolos como @, entre 3 y 60 caracteres.');
      return false;
    }

    if (!descripcion || !DESCRIPCION_REGEX.test(descripcion)) {
      alert('La descripción debe contener letras, entre 5 y 200 caracteres.');
      return false;
    }

    return true;
  }

  operate() {
    if (!this.validar()) return;

    const metodoPago = this.$metodoPago();
    const isEdit = metodoPago != null && metodoPago.idMetodoPago > 0;
    const msg = isEdit ? 'ACTUALIZADO' : 'REGISTRADO';

    const operation$ = isEdit
      ? this.metodoPagoService.update(metodoPago.idMetodoPago, metodoPago)
      : this.metodoPagoService.save(metodoPago);

    operation$.pipe(
      switchMap(() => this.metodoPagoService.findAll()),
      tap(data => this.metodoPagoService.setListChange(data)),
      tap(() => this.metodoPagoService.setMessageChange(msg))
    )
    .subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}