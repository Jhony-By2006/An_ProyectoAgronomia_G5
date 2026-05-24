import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReporteService } from '../../../services/reporte.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-reporte-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './reporte-dialog.component.html',
  styleUrl: './reporte-dialog.component.css',
})
export class ReporteDialogComponent {

  private readonly reporteService = inject(ReporteService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ReporteDialogComponent>);

  protected $reporte = signal({ ... this.data });

  operate(){

    const reporte = this.$reporte();

    const isEdit = reporte != null && reporte.idReporte > 0;

    const msg = isEdit ? 'UPDATED' : 'CREATED';

    const operation$ = isEdit
      ? this.reporteService.update(reporte.idReporte, reporte)
      : this.reporteService.save(reporte);

    operation$.pipe(
      switchMap(() => this.reporteService.findAll()),
      tap(data => this.reporteService.setListChange(data)),
      tap(() => this.reporteService.setMessageChange(msg))
    )
    .subscribe(() => this.close());

  }

  close(){
    this.dialogRef.close();
  }

}