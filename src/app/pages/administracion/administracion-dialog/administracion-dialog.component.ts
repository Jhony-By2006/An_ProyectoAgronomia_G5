import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select'; // <-- 1. IMPORTA ESTO
import { AdministracionService } from '../../../services/administracion.service';
import { Administracion } from '../../../model/administracion';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-administracion-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule, 
    FormsModule
  ],
  templateUrl: './administracion-dialog.component.html',
  styleUrl: './administracion-dialog.component.css',
})
export class AdministracionDialogComponent {
  private readonly administracionService = inject(AdministracionService);
  private readonly data = inject<Administracion>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AdministracionDialogComponent>);

  protected $administracion = signal<Administracion>(
    this.data 
      ? { ...this.data } 
      : {
          idAdministracion: 0,
          nombre: '',
          descripcion: '',
          fechaRegistro: '',
          responsable: '',
          estadoAdmin: true,
          inventario: {} as any,
          reporte: {} as any,
          trabajador: {} as any,
          metodoPago: {} as any
        }
  );
  
  operate() {
    const admin = this.$administracion();
    const isEdit = admin != null && admin.idAdministracion > 0;
    const msg = isEdit ? 'UPDATED' : 'CREATED';
    
    const operation$ = isEdit 
      ? this.administracionService.update(admin.idAdministracion, admin) 
      : this.administracionService.save(admin); 

    operation$.pipe(
      switchMap(() => this.administracionService.findAll()),
      tap(data => this.administracionService.setListChange(data)),
      tap(() => this.administracionService.setMessageChange(msg))
    )
    .subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}