import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select'; 
import { AdministracionService } from '../../../services/administracion.service';
import { Administracion } from '../../../model/administracion';
import { switchMap, tap } from 'rxjs';
import { InventarioService } from '../../../services/inventario.service';
import { RecursoAdministracionService } from '../../../services/recurso-administracion.service';
import { ReporteService } from '../../../services/reporte.service';
import { TrabajadorService } from '../../../services/trabajador.service';
import { MetodoPagoService } from '../../../services/metodopago.service';
import { Inventario } from '../../../model/inventario';
import { RecursoAdministracion } from '../../../model/recurso-administracion';
import { Reporte } from '../../../model/reporte';
import { Trabajador } from '../../../model/trabajador';
import { MetodoPago } from '../../../model/metodopago';

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
  private readonly inventarioService = inject(InventarioService);
  private readonly recursoAdministracionService = inject(RecursoAdministracionService);
  private readonly reporteService = inject(ReporteService);
  private readonly trabajadorService = inject(TrabajadorService);
  private readonly metodoPagoService = inject(MetodoPagoService);
  private readonly data = inject<Administracion>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AdministracionDialogComponent>);

  protected $inventariosList = signal<Inventario[]>([]);
  protected $recursosList = signal<RecursoAdministracion[]>([]);
  protected $reportesList = signal<Reporte[]>([]);
  protected $trabajadoresList = signal<Trabajador[]>([]);
  protected $metodosPagoList = signal<MetodoPago[]>([]);

  protected $administracion = signal<any>(
    this.data
      ? { ...this.data }
      : {
          idAdministracion: 0,
          nombre: '',
          descripcion: '',
          fechaRegistro: '',
          responsable: '',
          estadoAdmin: true,
          idInventario: null,
          idRecursoAdministracion: null,
          idReporte: null,
          idTrabajador: null,
          idMetodoPago: null,
        }
  );

  constructor() {
    this.inventarioService.findAll().subscribe(data => this.$inventariosList.set(data));
    this.recursoAdministracionService.findAll().subscribe(data => this.$recursosList.set(data));
    this.reporteService.findAll().subscribe(data => this.$reportesList.set(data));
    this.trabajadorService.findAll().subscribe(data => this.$trabajadoresList.set(data));
    this.metodoPagoService.findAll().subscribe(data => this.$metodosPagoList.set(data));
  }

  operate() {
    const admin = this.$administracion();
    const isEdit = admin.idAdministracion > 0;

    const payload: any = {
      nombre: admin.nombre,
      descripcion: admin.descripcion,
      fechaRegistro: admin.fechaRegistro,
      responsable: admin.responsable,
      estadoAdmin: admin.estadoAdmin,
      idInventario: admin.idInventario,
      idRecursoAdministracion: admin.idRecursoAdministracion,
      idReporte: admin.idReporte,
      idTrabajador: admin.idTrabajador,
      idMetodoPago: admin.idMetodoPago,
    };

    if (isEdit) payload.idAdministracion = admin.idAdministracion;

    const operation$ = isEdit
      ? this.administracionService.update(admin.idAdministracion, payload)
      : this.administracionService.save(payload);

    operation$.pipe(
      switchMap(() => this.administracionService.findAll()),
      tap(data => this.administracionService.setListChange(data)),
      tap(() => this.administracionService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    )
    .subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}