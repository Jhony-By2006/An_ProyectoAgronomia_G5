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

@Component({
  selector: 'app-metodopago-dialog',
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

  // Si data viene con valores (editar), los copia al signal; si es nuevo, parte vacío
  protected $metodoPago = signal({ ...this.data });

  operate() {
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