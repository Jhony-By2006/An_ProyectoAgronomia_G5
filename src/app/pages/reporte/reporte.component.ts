import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef
} from '@angular/material/dialog';
import { Reporte } from '../../../model/reporte';

@Component({
  selector: 'app-reporte-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule
  ],
  templateUrl: './reporte-dialog.component.html',
  styleUrl: './reporte-dialog.component.css',
})
export class ReporteDialogComponent {

  protected reporte: Reporte = inject(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<ReporteDialogComponent>);

  close(){
    this.dialogRef.close();
  }

}